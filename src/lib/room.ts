import { nanoid } from 'nanoid';

/**
 * Otaq identifikatorunu URL hash-indən oxuyur (`https://.../#<roomId>`).
 * Hash yoxdursa, yeni id yaradır və URL-ə yazır — beləliklə istifadəçi
 * dərhal paylaşıla bilən bir linkə sahib olur.
 */
export function getRoomId(): string {
  const existing = window.location.hash.replace(/^#/, '').trim();
  if (existing) return existing;

  const id = nanoid(8);
  window.location.hash = id;
  return id;
}
