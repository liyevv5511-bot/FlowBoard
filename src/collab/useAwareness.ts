import { useCallback, useEffect, useRef, useState } from 'react';
import { useRoom } from './roomContext';
import { generateName } from '../lib/names';
import { pickCursorColor } from '../lib/colors';
import type { PresenceState, UserInfo } from '../types';

/**
 * Canlı presence (kursorlar + istifadəçi kimliyi) awareness protokolu vasitəsilə.
 *
 * Awareness EFEMER-dir: Y.Doc-a yazılmır, davam etmir və istifadəçi
 * ayrıldıqda avtomatik təmizlənir. Kursorlar DÜNYA koordinatlarında yayımlanır
 * ki, hər alıcı öz zoom/pan-ına uyğun düzgün yerə çəksin.
 */

const NAME_STORAGE_KEY = 'flowboard-username';

/** İstifadəçi adını localStorage-dən oxuyur, yoxdursa yeni yaradıb saxlayır. */
function loadOrCreateName(): string {
  try {
    const stored = localStorage.getItem(NAME_STORAGE_KEY);
    if (stored) return stored;
    const name = generateName();
    localStorage.setItem(NAME_STORAGE_KEY, name);
    return name;
  } catch {
    return generateName();
  }
}

export function useAwareness() {
  const { room } = useRoom();
  const awareness = room.provider.awareness;

  // Bu klientin sabit kimliyi (clientID awareness tərəfindən verilir).
  const selfRef = useRef<UserInfo>({
    id: awareness.clientID,
    name: loadOrCreateName(),
    color: pickCursorColor(awareness.clientID),
  });

  // Digər istifadəçilərin presence vəziyyəti (özümüz istisna).
  const [others, setOthers] = useState<PresenceState[]>([]);

  // Öz kimliyimizi bir dəfə yayımlayırıq.
  useEffect(() => {
    awareness.setLocalStateField('user', selfRef.current);
    awareness.setLocalStateField('cursor', null);
  }, [awareness]);

  // Awareness dəyişikliklərini izləyib "others" siyahısını yeniləyirik.
  useEffect(() => {
    const update = () => {
      const states: PresenceState[] = [];
      awareness.getStates().forEach((state, clientId) => {
        if (clientId === awareness.clientID) return; // özümüzü atlayırıq
        const user = state.user as UserInfo | undefined;
        if (!user) return;
        states.push({
          user,
          cursor: (state.cursor as PresenceState['cursor']) ?? null,
        });
      });
      setOthers(states);
    };
    update();
    awareness.on('change', update);
    return () => awareness.off('change', update);
  }, [awareness]);

  /** Bu istifadəçinin kursor mövqeyini yayımlayır (dünya koordinatları). */
  const setCursor = useCallback(
    (cursor: { x: number; y: number } | null) => {
      awareness.setLocalStateField('cursor', cursor);
    },
    [awareness],
  );

  return { self: selfRef.current, others, setCursor };
}
