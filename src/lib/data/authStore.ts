import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAllowedAdminEmails, syncFromFirestore } from './articlesStore';

const STORAGE_PASSWORDS_KEY = 'flyo_user_passwords_cache_v1';
export const DEFAULT_USER_PASSWORD = 'user';

function readLocalPasswords(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_PASSWORDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalPasswords(cache: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PASSWORDS_KEY, JSON.stringify(cache));
  } catch {}
}

let localPasswordsCache: Record<string, string> = readLocalPasswords();

/**
 * Fetch and verify a user's password.
 * Default password is "user" unless changed by the user.
 */
export async function verifyUserPassword(email: string, passwordInput: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanEmail) {
    return { valid: false, error: 'Please enter your partner email.' };
  }
  if (!cleanPass) {
    return { valid: false, error: 'Please enter your password.' };
  }

  // 1. Verify email is in allowed list
  try {
    await syncFromFirestore();
  } catch {}

  const allowed = getAllowedAdminEmails();
  if (!allowed.some(e => e.toLowerCase() === cleanEmail)) {
    return { valid: false, error: `Access Denied: "${cleanEmail}" is not authorized for flyoo businesses partner access.` };
  }

  // 2. Fetch password from Firestore
  let savedPassword = DEFAULT_USER_PASSWORD;

  // Check local cache first
  if (localPasswordsCache[cleanEmail]) {
    savedPassword = localPasswordsCache[cleanEmail];
  }

  // Check remote Firestore
  if (db) {
    try {
      const passDoc = await getDoc(doc(db, 'user_passwords', cleanEmail));
      if (passDoc.exists()) {
        const data = passDoc.data();
        if (data?.password) {
          savedPassword = data.password;
          localPasswordsCache[cleanEmail] = savedPassword;
          writeLocalPasswords(localPasswordsCache);
        }
      }
    } catch (err) {
      console.error('Firestore password fetch error:', err);
    }
  }

  if (cleanPass === savedPassword) {
    return { valid: true };
  }

  return {
    valid: false,
    error: savedPassword === DEFAULT_USER_PASSWORD
      ? 'Incorrect password. (Initial default password is "user")'
      : 'Incorrect password. Please try again.',
  };
}

/**
 * Change a user's password and save to Firestore + Local Storage
 */
export async function changeUserPassword(
  email: string,
  currentPasswordInput: string,
  newPasswordInput: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCurrent = currentPasswordInput.trim();
  const cleanNew = newPasswordInput.trim();

  if (!cleanNew) {
    return { success: false, error: 'New password cannot be empty.' };
  }
  if (cleanNew.length < 3) {
    return { success: false, error: 'New password must be at least 3 characters long.' };
  }

  // Verify current password
  const verifyRes = await verifyUserPassword(cleanEmail, cleanCurrent);
  if (!verifyRes.valid) {
    return { success: false, error: verifyRes.error || 'Current password is incorrect.' };
  }

  // Save new password
  localPasswordsCache[cleanEmail] = cleanNew;
  writeLocalPasswords(localPasswordsCache);

  if (db) {
    try {
      await setDoc(doc(db, 'user_passwords', cleanEmail), {
        email: cleanEmail,
        password: cleanNew,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (err) {
      console.error('Firestore password update error:', err);
      // Fallback: local storage succeeded
      return { success: true };
    }
  }

  return { success: true };
}
