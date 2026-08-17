import { TeamMember } from '@/lib/types/seo';
import { TEAM_MEMBERS as STATIC_TEAM } from './team';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

const STORAGE_KEY = 'flyo_team_members_v1';

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

// In-memory cache; initialised from localStorage (or falls back to static defaults)
let teamCache: TeamMember[] = readLocal<TeamMember[]>(STORAGE_KEY, STATIC_TEAM);

// ─────────────────────────────────────────────────────────────────────────────
// Sync from Firestore
// ─────────────────────────────────────────────────────────────────────────────
export async function syncTeamFromFirestore(): Promise<void> {
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, 'team_members'));
    if (!snap.empty) {
      teamCache = snap.docs
        .map(d => d.data() as TeamMember)
        .sort((a, b) => a.order - b.order);
      writeLocal(STORAGE_KEY, teamCache);
    }
  } catch (err) {
    console.error('Team Firestore sync error:', err);
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

// ─────────────────────────────────────────────────────────────────────────────
// Writes
// ─────────────────────────────────────────────────────────────────────────────

/** Add or update a team member */
export async function saveTeamMember(member: TeamMember): Promise<boolean> {
  // Upsert in cache
  teamCache = [member, ...teamCache.filter(m => m.id !== member.id)]
    .sort((a, b) => a.order - b.order);
  writeLocal(STORAGE_KEY, teamCache);

  if (db) {
    try {
      await setDoc(doc(db, 'team_members', member.id), member);
      return true;
    } catch (err) {
      console.error('Team save error:', err);
      return false;
    }
  }
  return true;
}

/** Delete a team member by id */
export async function deleteTeamMember(id: string): Promise<boolean> {
  teamCache = teamCache.filter(m => m.id !== id);
  writeLocal(STORAGE_KEY, teamCache);

  if (db) {
    try {
      await deleteDoc(doc(db, 'team_members', id));
      return true;
    } catch (err) {
      console.error('Team delete error:', err);
      return false;
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
