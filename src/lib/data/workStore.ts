import { WorkProject } from '@/lib/types/seo';
import { PORTFOLIO_DATA as STATIC_PORTFOLIO } from './work';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

const STORAGE_KEY = 'flyo_dynamic_projects_v3';

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

let dynamicProjectsCache: WorkProject[] = readLocal<WorkProject[]>(STORAGE_KEY, []);

/** Sync fresh projects from Firebase Firestore */
export async function syncProjectsFromFirestore(): Promise<void> {
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, 'projects'));
    if (!snap.empty) {
      dynamicProjectsCache = snap.docs.map((d) => d.data() as WorkProject);
      writeLocal(STORAGE_KEY, dynamicProjectsCache);
    }
  } catch (err: any) {
    console.warn('Projects Firestore sync notice (using local cache):', err?.message || err);
  }
}

/** Get all projects (Static + Dynamic) */
export function getAllProjects(): WorkProject[] {
  const dynamicSlugs = new Set(dynamicProjectsCache.map((p) => p.slug));
  const filteredStatic = STATIC_PORTFOLIO.filter((p) => !dynamicSlugs.has(p.slug));
  return [...dynamicProjectsCache, ...filteredStatic];
}

/** Save or update a project */
export async function saveProject(project: WorkProject): Promise<boolean> {
  dynamicProjectsCache = [project, ...dynamicProjectsCache.filter((p) => p.slug !== project.slug)];
  writeLocal(STORAGE_KEY, dynamicProjectsCache);

  if (db) {
    try {
      await setDoc(doc(db, 'projects', project.slug), project);
    } catch (err: any) {
      console.warn('Project setDoc notice (saved locally):', err?.message || err);
    }
  }
  return true;
}

/** Delete a project by slug */
export async function deleteProject(slug: string): Promise<boolean> {
  dynamicProjectsCache = dynamicProjectsCache.filter((p) => p.slug !== slug);
  writeLocal(STORAGE_KEY, dynamicProjectsCache);

  if (db) {
    try {
      await deleteDoc(doc(db, 'projects', slug));
    } catch (err: any) {
      console.warn('Project deleteDoc notice (removed locally):', err?.message || err);
    }
  }
  return true;
}
