import { TeamMember } from '@/lib/types/seo';
import { TEAM_MEMBERS as STATIC_TEAM } from './team';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, getDoc, collection } from 'firebase/firestore';

const STORAGE_KEY = 'flyo_team_members_v6';

/**
 * Sanitize member object so NO field is ever `undefined`.
 * Firestore throws a silent error if any field in an object is `undefined`.
 */
export function sanitizeMember(m: Partial<TeamMember>): TeamMember {
  const clean: any = {
    id: String(m.id || '').trim() || `member-${Date.now()}`,
    name: String(m.name || '').trim(),
    role: String(m.role || '').trim(),
    bio: String(m.bio || '').trim(),
    college: String(m.college || '').trim(),
    avatar: String(m.avatar || '').trim(),
    order: Number(m.order) || 0,
    visible: m.visible !== false,
  };
  if (m.linkedin && String(m.linkedin).trim()) {
    clean.linkedin = String(m.linkedin).trim();
  }
  if (m.twitter && String(m.twitter).trim()) {
    clean.twitter = String(m.twitter).trim();
  }
  return clean as TeamMember;
}

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
let teamCache: TeamMember[] = readLocal<TeamMember[]>(STORAGE_KEY, STATIC_TEAM).map(sanitizeMember);

// ─────────────────────────────────────────────────────────────────────────────
// Sync from Firestore (Cloud settings store is primary — sanitized)
// ─────────────────────────────────────────────────────────────────────────────
export async function syncTeamFromFirestore(): Promise<void> {
  if (!db) return;
  try {
    // 1. Primary Cloud Sync: Read from settings/team_members_store
    const settingsDoc = await getDoc(doc(db, 'settings', 'team_members_store'));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      if (Array.isArray(data?.members) && data.members.length > 0) {
        teamCache = (data.members as TeamMember[])
          .map(sanitizeMember)
          .sort((a, b) => a.order - b.order);
        writeLocal(STORAGE_KEY, teamCache);
        firestoreSynced = true;
        return;
      }
    }

    // 2. Secondary Cloud Sync: Fallback if settings document doesn't exist
    const snap = await getDocs(collection(db, 'team_members'));
    if (!snap.empty) {
      teamCache = snap.docs
        .map(d => sanitizeMember(d.data() as TeamMember))
        .sort((a, b) => a.order - b.order);
      writeLocal(STORAGE_KEY, teamCache);
    }

    firestoreSynced = true;
  } catch (err: any) {
    console.warn('Team Firestore sync notice:', err?.message || err);
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
// Writes (Pushes directly to Firebase Cloud settings store — 100% sanitized)
// ─────────────────────────────────────────────────────────────────────────────

/** Add or update a team member */
export async function saveTeamMember(member: TeamMember): Promise<boolean> {
  const cleanMember = sanitizeMember(member);

  // 1. Instantly update local memory & localStorage
  const filtered = teamCache.filter(m => m.id !== cleanMember.id);
  teamCache = [cleanMember, ...filtered].sort((a, b) => a.order - b.order);
  writeLocal(STORAGE_KEY, teamCache);

  // 2. Push sanitized list to Firebase Cloud settings/team_members_store
  if (db) {
    const sanitizedList = teamCache.map(sanitizeMember);
    try {
      await setDoc(doc(db, 'settings', 'team_members_store'), {
        members: sanitizedList,
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('Cloud settings write notice:', err?.message || err);
    }

    // 3. Backup write to collection('team_members')
    try {
      await setDoc(doc(db, 'team_members', cleanMember.id), cleanMember);
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
    const sanitizedList = teamCache.map(sanitizeMember);
    try {
      await setDoc(doc(db, 'settings', 'team_members_store'), {
        members: sanitizedList,
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
