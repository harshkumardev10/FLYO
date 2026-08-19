import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, businessName, email, phone, serviceRequired, message } = body;

    // Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const payload = {
      name: String(name).trim(),
      businessName: String(businessName || '').trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      serviceRequired: String(serviceRequired || 'Web Development').trim(),
      message: String(message).trim(),
      submittedAt: new Date().toISOString(),
    };

    let firestoreSaved = false;
    let sheetSaved = false;
    let sheetError: string | null = null;

    // 1. Save to Firebase Firestore (Record Backup)
    try {
      if (db) {
        await addDoc(collection(db, 'contact_inquiries'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        firestoreSaved = true;
      }
    } catch (err) {
      console.error('Error saving inquiry to Firestore:', err);
    }

    // 2. Forward to Google Sheets via Webhook (if URL configured)
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;

    if (googleSheetWebhookUrl) {
      try {
        // Google Apps Script requires text/plain header or form-data to bypass Google auth proxy issues
        const sheetResponse = await fetch(googleSheetWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
          redirect: 'follow',
        });

        // Google Apps Script returns 200 or 302 on success
        if (sheetResponse.ok || sheetResponse.status === 302 || sheetResponse.status === 301) {
          sheetSaved = true;
        } else {
          sheetError = `Google Sheet Webhook returned status ${sheetResponse.status}`;
          console.warn(sheetError);
        }
      } catch (err: any) {
        sheetError = err?.message || 'Failed to reach Google Sheet Webhook';
        console.error('Error posting to Google Sheet Webhook:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully!',
      details: {
        firestoreSaved,
        sheetSaved,
        sheetConfigured: Boolean(googleSheetWebhookUrl),
        ...(sheetError ? { sheetError } : {}),
      },
    });
  } catch (error: any) {
    console.error('Error processing contact submission:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing inquiry.' },
      { status: 500 }
    );
  }
}
