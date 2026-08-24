/*  */import { ArticleItem } from '@/lib/types/seo';
import { ARTICLES_DATA } from './articles';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, getDoc, collection, onSnapshot } from 'firebase/firestore';

export const MAIN_ADMIN_EMAIL = 'harshkumarrr143@gmail.com';

export const DEFAULT_ALLOWED_EMAILS = [
  MAIN_ADMIN_EMAIL,
];

const STORAGE_KEYS = {
  ALLOWED_EMAILS: 'flyo_allowed_admin_emails_v3',
  DYNAMIC_ARTICLES: 'flyo_dynamic_articles_v3',
  HIDDEN_SLUGS: 'flyo_hidden_slugs_v3',
};

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) { }
}

// In-Memory & Local Storage Cache (Synced live with Firebase Firestore)
let firestoreArticlesCache: ArticleItem[] = readLocal<ArticleItem[]>(STORAGE_KEYS.DYNAMIC_ARTICLES, []);
let hiddenSlugsCache: string[] = readLocal<string[]>(STORAGE_KEYS.HIDDEN_SLUGS, []);
let allowedEmailsCache: string[] = readLocal<string[]>(STORAGE_KEYS.ALLOWED_EMAILS, [...DEFAULT_ALLOWED_EMAILS]);

/**
 * Fetch fresh data directly from Firebase Firestore and update local cache
 */
export async function syncFromFirestore(): Promise<void> {
  if (!db) return;
  try {
    // 1. Fetch articles from Firebase Firestore
    const articlesSnapshot = await getDocs(collection(db, 'articles'));
    if (!articlesSnapshot.empty) {
      firestoreArticlesCache = articlesSnapshot.docs.map(docSnap => docSnap.data() as ArticleItem);
      writeLocal(STORAGE_KEYS.DYNAMIC_ARTICLES, firestoreArticlesCache);
    }

    // 2. Fetch hidden slugs from Firebase Firestore
    const hiddenSnapshot = await getDocs(collection(db, 'hidden_slugs'));
    if (!hiddenSnapshot.empty) {
      hiddenSlugsCache = hiddenSnapshot.docs.map(docSnap => docSnap.id);
      writeLocal(STORAGE_KEYS.HIDDEN_SLUGS, hiddenSlugsCache);
    }

    // 3. Fetch allowed partner emails directly from Firebase Firestore
    let fetchedEmails: string[] = [];

    try {
      const emailsDoc = await getDoc(doc(db, 'settings', 'allowed_emails'));
      if (emailsDoc.exists()) {
        const data = emailsDoc.data();
        if (Array.isArray(data.emails)) {
          fetchedEmails = data.emails.map((e: string) => String(e).toLowerCase());
        }
      }
    } catch (err) { }

    try {
      const emailsCollSnapshot = await getDocs(collection(db, 'allowed_emails'));
      if (!emailsCollSnapshot.empty) {
        const collEmails = emailsCollSnapshot.docs.map(docSnap => docSnap.id.toLowerCase());
        fetchedEmails = Array.from(new Set([...fetchedEmails, ...collEmails]));
      }
    } catch (err) { }

    if (fetchedEmails.length > 0) {
      allowedEmailsCache = Array.from(new Set([MAIN_ADMIN_EMAIL.toLowerCase(), ...fetchedEmails]));
      writeLocal(STORAGE_KEYS.ALLOWED_EMAILS, allowedEmailsCache);
    } else {
      // If allowed_emails doesn't exist in Firebase Firestore yet, write initial list to Firebase
      await setDoc(doc(db, 'settings', 'allowed_emails'), { emails: allowedEmailsCache });
      for (const e of allowedEmailsCache) {
        await setDoc(doc(db, 'allowed_emails', e.toLowerCase()), { email: e.toLowerCase(), addedAt: new Date().toISOString() });
      }
    }
  } catch (err) {
    console.error('Firebase Firestore sync error:', err);
  }
}

/**
 * Get ONLY dynamically uploaded articles
 */
export function getDynamicArticles(): ArticleItem[] {
  return firestoreArticlesCache;
}

/**
 * Get slugs of statically-hidden (soft-deleted) articles
 */
export function getHiddenSlugs(): string[] {
  return hiddenSlugsCache;
}

/**
 * Get combined list of static articles + Firebase articles
 * For PUBLIC view: shows approved dynamic articles, and ALL static articles
 * unless they are explicitly hidden OR overridden by an approved Firestore version.
 */
export function getAllArticles(): ArticleItem[] {
  // Only approved Firestore articles are visible publicly
  const approvedCustom = firestoreArticlesCache.filter(a => a.status === 'approved' || !a.status);

  // Slugs that have an approved Firestore version (they replace the static copy)
  const approvedCustomSlugs = approvedCustom.map(a => a.slug);

  // Static articles that:
  //   1. Are NOT explicitly soft-deleted (in hidden_slugs)
  //   2. Are NOT overridden by an APPROVED Firestore version
  const visibleStatic = ARTICLES_DATA.filter(
    a => !hiddenSlugsCache.includes(a.slug) && !approvedCustomSlugs.includes(a.slug)
  );

  return [...approvedCustom, ...visibleStatic];
}

/**
 * Get ALL articles (including pending ones) for Admin Workspace view
 * Shows every Firestore article + every static article not explicitly hidden.
 * If a static article also exists in Firestore, shows the Firestore version (so edits are visible).
 */
export function getAllArticlesForAdmin(): ArticleItem[] {
  const firestoreSlugs = firestoreArticlesCache.map(a => a.slug);

  // Static articles that haven't been soft-deleted (Firestore version shown instead if exists)
  const visibleStatic = ARTICLES_DATA.filter(
    a => !hiddenSlugsCache.includes(a.slug) && !firestoreSlugs.includes(a.slug)
  );

  return [...firestoreArticlesCache, ...visibleStatic];
}

/**
 * Save / Publish an article directly to Firebase Firestore & local cache
 */
export async function saveArticle(article: ArticleItem): Promise<boolean> {
  // Update in-memory & local storage cache immediately
  firestoreArticlesCache = [article, ...firestoreArticlesCache.filter(a => a.slug !== article.slug)];
  writeLocal(STORAGE_KEYS.DYNAMIC_ARTICLES, firestoreArticlesCache);

  if (hiddenSlugsCache.includes(article.slug)) {
    hiddenSlugsCache = hiddenSlugsCache.filter(s => s !== article.slug);
    writeLocal(STORAGE_KEYS.HIDDEN_SLUGS, hiddenSlugsCache);
    if (db) {
      try {
        await deleteDoc(doc(db, 'hidden_slugs', article.slug));
      } catch (err) { }
    }
  }

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
  writeLocal(STORAGE_KEYS.DYNAMIC_ARTICLES, firestoreArticlesCache);

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
  writeLocal(STORAGE_KEYS.DYNAMIC_ARTICLES, firestoreArticlesCache);

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
  writeLocal(STORAGE_KEYS.DYNAMIC_ARTICLES, firestoreArticlesCache);

  // If static article, add to hidden list
  const isStatic = ARTICLES_DATA.some(a => a.slug === slug);
  if (isStatic && !hiddenSlugsCache.includes(slug)) {
    hiddenSlugsCache.push(slug);
    writeLocal(STORAGE_KEYS.HIDDEN_SLUGS, hiddenSlugsCache);
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
 * Get authorized admin email list
 */
export function getAllowedAdminEmails(): string[] {
  if (!allowedEmailsCache.includes(MAIN_ADMIN_EMAIL.toLowerCase())) {
    allowedEmailsCache.unshift(MAIN_ADMIN_EMAIL.toLowerCase());
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
  writeLocal(STORAGE_KEYS.ALLOWED_EMAILS, allowedEmailsCache);

  // Save directly to Firebase Firestore (both settings doc AND allowed_emails collection)
  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'allowed_emails'), { emails: allowedEmailsCache });
      await setDoc(doc(db, 'allowed_emails', lower), { email: lower, addedAt: new Date().toISOString() });
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
  writeLocal(STORAGE_KEYS.ALLOWED_EMAILS, allowedEmailsCache);

  // Save directly to Firebase Firestore (both settings doc AND allowed_emails collection)
  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'allowed_emails'), { emails: allowedEmailsCache });
      await deleteDoc(doc(db, 'allowed_emails', lower));
    } catch (err) {
      console.error('Firebase remove email error:', err);
    }
  }

  return allowedEmailsCache;
}


