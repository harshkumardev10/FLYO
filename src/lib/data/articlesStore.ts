import { ArticleItem } from '@/lib/types/seo';
import { ARTICLES_DATA } from './articles';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, getDoc, collection } from 'firebase/firestore';

export const MAIN_ADMIN_EMAIL = 'harshkumarrr143@gmail.com';

export const DEFAULT_ALLOWED_EMAILS = [
  'harshkumarrr143@gmail.com',
  'admin@flyodigital.com',
  'alex@flyodigital.com',
  'sam@flyodigital.com',
  'maya@flyodigital.com',
  'jordan@flyodigital.com',
  'partner@flyodigital.com',
];

// In-Memory Firebase Cache (Synced directly with Firestore)
let firestoreArticlesCache: ArticleItem[] = [];
let hiddenSlugsCache: string[] = [];
let allowedEmailsCache: string[] = [...DEFAULT_ALLOWED_EMAILS];
let isInitialized = false;

/**
 * Fetch fresh data directly from Firebase Firestore
 */
export async function syncFromFirestore(): Promise<void> {
  if (!db) return;
  try {
    // 1. Fetch articles from Firebase Firestore
    const articlesSnapshot = await getDocs(collection(db, 'articles'));
    if (!articlesSnapshot.empty) {
      firestoreArticlesCache = articlesSnapshot.docs.map(docSnap => docSnap.data() as ArticleItem);
    } else {
      firestoreArticlesCache = [];
    }

    // 2. Fetch hidden slugs from Firebase Firestore
    const hiddenSnapshot = await getDocs(collection(db, 'hidden_slugs'));
    if (!hiddenSnapshot.empty) {
      hiddenSlugsCache = hiddenSnapshot.docs.map(docSnap => docSnap.id);
    } else {
      hiddenSlugsCache = [];
    }

    // 3. Fetch allowed partner emails from Firebase Firestore
    const emailsDoc = await getDoc(doc(db, 'settings', 'allowed_emails'));
    if (emailsDoc.exists()) {
      const data = emailsDoc.data();
      if (Array.isArray(data.emails)) {
        allowedEmailsCache = Array.from(new Set([MAIN_ADMIN_EMAIL, ...data.emails.map((e: string) => String(e).toLowerCase())]));
      }
    }
    isInitialized = true;
  } catch (err) {
    console.error('Firebase Firestore sync error:', err);
  }
}

/**
 * Get ONLY dynamically uploaded articles from Firebase Cache
 */
export function getDynamicArticles(): ArticleItem[] {
  return firestoreArticlesCache;
}

/**
 * Get slugs of statically-hidden (soft-deleted) articles from Firebase Cache
 */
export function getHiddenSlugs(): string[] {
  return hiddenSlugsCache;
}

/**
 * Get combined list of static articles + Firebase articles
 * For PUBLIC view: Filters out soft-deleted static slugs AND pending articles.
 */
export function getAllArticles(): ArticleItem[] {
  const customSlugs = firestoreArticlesCache.map(a => a.slug);

  // Public only sees approved dynamic articles
  const approvedCustom = firestoreArticlesCache.filter(a => a.status === 'approved' || !a.status);
  
  // Static articles that haven't been soft-deleted and aren't overridden in Firebase
  const visibleStatic = ARTICLES_DATA.filter(
    a => !hiddenSlugsCache.includes(a.slug) && !customSlugs.includes(a.slug)
  );

  return [...approvedCustom, ...visibleStatic];
}

/**
 * Get ALL articles (including pending ones) for Admin Workspace view from Firebase
 */
export function getAllArticlesForAdmin(): ArticleItem[] {
  const customSlugs = firestoreArticlesCache.map(a => a.slug);

  const visibleStatic = ARTICLES_DATA.filter(
    a => !hiddenSlugsCache.includes(a.slug) && !customSlugs.includes(a.slug)
  );

  return [...firestoreArticlesCache, ...visibleStatic];
}

/**
 * Save / Publish an article directly to Firebase Firestore
 */
export async function saveArticle(article: ArticleItem): Promise<boolean> {
  // Update in-memory Firebase cache immediately
  firestoreArticlesCache = [article, ...firestoreArticlesCache.filter(a => a.slug !== article.slug)];

  // Write directly to Firebase Firestore database
  if (db) {
    try {
      await setDoc(doc(db, 'articles', article.slug), article);
      return true;
    } catch (err) {
      console.error('Firebase save error:', err);
      return false;
    }
  }
  return true;
}

/**
 * Approve a pending article directly in Firebase Firestore
 */
export async function approveArticle(slug: string): Promise<boolean> {
  const existingIndex = firestoreArticlesCache.findIndex(a => a.slug === slug);
  let updatedArticle: ArticleItem;

  if (existingIndex !== -1) {
    updatedArticle = { ...firestoreArticlesCache[existingIndex], status: 'approved' };
    firestoreArticlesCache[existingIndex] = updatedArticle;
  } else {
    const staticArt = ARTICLES_DATA.find(a => a.slug === slug);
    if (!staticArt) return false;
    updatedArticle = { ...staticArt, status: 'approved' };
    firestoreArticlesCache = [updatedArticle, ...firestoreArticlesCache];
  }

  // Write directly to Firebase Firestore database
  if (db) {
    try {
      await setDoc(doc(db, 'articles', slug), updatedArticle, { merge: true });
      return true;
    } catch (err) {
      console.error('Firebase approve error:', err);
      return false;
    }
  }

  return true;
}

/**
 * Unpublish / Stop an article directly in Firebase Firestore
 */
export async function unpublishArticle(slug: string): Promise<boolean> {
  const existingIndex = firestoreArticlesCache.findIndex(a => a.slug === slug);
  let updatedArticle: ArticleItem;

  if (existingIndex !== -1) {
    updatedArticle = { ...firestoreArticlesCache[existingIndex], status: 'pending' };
    firestoreArticlesCache[existingIndex] = updatedArticle;
  } else {
    const staticArt = ARTICLES_DATA.find(a => a.slug === slug);
    if (!staticArt) return false;
    updatedArticle = { ...staticArt, status: 'pending' };
    firestoreArticlesCache = [updatedArticle, ...firestoreArticlesCache];
  }

  // Write directly to Firebase Firestore database
  if (db) {
    try {
      await setDoc(doc(db, 'articles', slug), updatedArticle, { merge: true });
      return true;
    } catch (err) {
      console.error('Firebase unpublish error:', err);
      return false;
    }
  }

  return true;
}

/**
 * Delete an article directly in Firebase Firestore
 */
export async function removeArticle(slug: string): Promise<ArticleItem[]> {
  // Remove from dynamic cache
  firestoreArticlesCache = firestoreArticlesCache.filter(a => a.slug !== slug);

  // If static article, add to hidden list
  const isStatic = ARTICLES_DATA.some(a => a.slug === slug);
  if (isStatic && !hiddenSlugsCache.includes(slug)) {
    hiddenSlugsCache.push(slug);
    if (db) {
      try {
        await setDoc(doc(db, 'hidden_slugs', slug), { hiddenAt: new Date().toISOString() });
      } catch (err) {
        console.error('Firebase hide static error:', err);
      }
    }
  }

  // Delete directly from Firebase Firestore collection
  if (db) {
    try {
      await deleteDoc(doc(db, 'articles', slug));
    } catch (err) {
      console.error('Firebase delete error:', err);
    }
  }

  return firestoreArticlesCache;
}

/**
 * Get authorized admin email list from Firebase
 */
export function getAllowedAdminEmails(): string[] {
  if (!allowedEmailsCache.includes(MAIN_ADMIN_EMAIL)) {
    allowedEmailsCache.unshift(MAIN_ADMIN_EMAIL);
  }
  return Array.from(new Set(allowedEmailsCache));
}

/**
 * Add a new authorized admin email directly to Firebase Firestore
 */
export async function addAllowedAdminEmail(email: string): Promise<string[]> {
  const lower = email.trim().toLowerCase();
  if (!lower || allowedEmailsCache.includes(lower)) return allowedEmailsCache;

  allowedEmailsCache = Array.from(new Set([...allowedEmailsCache, lower]));

  // Save to Firebase Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'allowed_emails'), { emails: allowedEmailsCache }, { merge: true });
    } catch (err) {
      console.error('Firebase add email error:', err);
    }
  }

  return allowedEmailsCache;
}

/**
 * Remove an authorized admin email directly from Firebase Firestore
 */
export async function removeAllowedAdminEmail(email: string): Promise<string[]> {
  const lower = email.trim().toLowerCase();
  if (lower === MAIN_ADMIN_EMAIL.toLowerCase()) return allowedEmailsCache;

  allowedEmailsCache = allowedEmailsCache.filter(e => e !== lower);

  // Save to Firebase Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'allowed_emails'), { emails: allowedEmailsCache }, { merge: true });
    } catch (err) {
      console.error('Firebase remove email error:', err);
    }
  }

  return allowedEmailsCache;
}


