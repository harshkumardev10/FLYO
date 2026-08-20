import { TeamMember } from '@/lib/types/seo';
import { TEAM_MEMBERS as STATIC_TEAM } from './team';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, getDoc, collection } from 'firebase/firestore';

const STORAGE_KEY = 'flyo_team_members_v4';

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

let firestoreSynced = false;

// Initialise in-memory cache from localStorage (or fall back to static defaults)
let teamCache: TeamMember[] = readLocal<TeamMember[]>(STORAGE_KEY, STATIC_TEAM);

// ─────────────────────────────────────────────────────────────────────────────
// Sync from Firestore (Fetches Cloud settings document — works on ALL devices)
// ─────────────────────────────────────────────────────────────────────────────
export async function syncTeamFromFirestore(): Promise<void> {
  if (!db) return;
  try {
    // 1. Primary Cloud Sync: Read from settings/team_members_store
    let fetchedMembers: TeamMember[] = [];
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'team_members_store'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        if (Array.isArray(data?.members) && data.members.length > 0) {
          fetchedMembers = data.members as TeamMember[];
        }
      }
    } catch (err) {
      console.warn('Settings team sync notice:', err);
    }

    // 2. Secondary Cloud Sync: Fall back / merge with collection('team_members')
    try {
      const snap = await getDocs(collection(db, 'team_members'));
      if (!snap.empty) {
        const collMembers = snap.docs.map(d => d.data() as TeamMember);
        // Merge by id (collection members override if newer)
        const idMap = new Map<string, TeamMember>();
        fetchedMembers.forEach(m => idMap.set(m.id, m));
        collMembers.forEach(m => idMap.set(m.id, m));
        fetchedMembers = Array.from(idMap.values());
      }
    } catch (err) {
      console.warn('Collection team sync notice:', err);
    }

    if (fetchedMembers.length > 0) {
      teamCache = fetchedMembers.sort((a, b) => a.order - b.order);
      writeLocal(STORAGE_KEY, teamCache);
    }

    firestoreSynced = true;
  } catch (err: any) {
    console.warn('Team Firestore sync error:', err?.message || err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reads
// ─────────────────────────────────────────────────────────────────────────────

/** All members (admin view — includes hidden) */
export function getAllTeamMembersForAdmin(): TeamMember[] {
  return [...teamCache].sort((a, b) => a.order - b.order);
}

/** Only visible members (public site view) */
export function getVisibleTeamMembers(): TeamMember[] {
  return [...teamCache]
    .filter(m => m.visible)
    .sort((a, b) => a.order - b.order);
}

/** Whether we have confirmed sync from Firestore */
export function isTeamSynced(): boolean {
  return firestoreSynced;
}

// ─────────────────────────────────────────────────────────────────────────────
// Writes (Pushes directly to Firebase Cloud settings store for ALL devices)
// ─────────────────────────────────────────────────────────────────────────────

/** Add or update a team member */
export async function saveTeamMember(member: TeamMember): Promise<boolean> {
  // 1. Instantly update local memory & localStorage
  const filtered = teamCache.filter(m => m.id !== member.id);
  teamCache = [member, ...filtered].sort((a, b) => a.order - b.order);
  writeLocal(STORAGE_KEY, teamCache);

  // 2. Push to Firebase Cloud settings/team_members_store (Works across ALL devices)
  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'team_members_store'), {
        members: teamCache,
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('Cloud settings write notice:', err?.message || err);
    }

    // 3. Backup write to collection('team_members')
    try {
      await setDoc(doc(db, 'team_members', member.id), member);
    } catch (err: any) {
      console.warn('Collection setDoc notice:', err?.message || err);
    }
  }

  return true;
}

/** Delete a team member by id */
export async function deleteTeamMember(id: string): Promise<boolean> {
  // 1. Instantly update local memory & localStorage
  teamCache = teamCache.filter(m => m.id !== id);
  writeLocal(STORAGE_KEY, teamCache);

  // 2. Update Firebase Cloud settings/team_members_store
  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'team_members_store'), {
        members: teamCache,
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('Cloud settings delete notice:', err?.message || err);
    }

    // 3. Backup delete from collection('team_members')
    try {
      await deleteDoc(doc(db, 'team_members', id));
    } catch (err: any) {
      console.warn('Collection deleteDoc notice:', err?.message || err);
    }
  }

  return true;
}

/** Toggle visibility (show / hide on site) */
export async function toggleTeamMemberVisibility(id: string): Promise<boolean> {
  const member = teamCache.find(m => m.id === id);
  if (!member) return false;
  return saveTeamMember({ ...member, visible: !member.visible });
}
