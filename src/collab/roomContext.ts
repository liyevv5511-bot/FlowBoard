import { createContext, useContext, useEffect, useState } from 'react';
import type * as Y from 'yjs';
import type { Room } from './doc';

/**
 * Otaq konteksti + əlaqəli hook-lar (komponent DEYİL).
 * Komponent (RoomProvider) ayrı faylda saxlanır ki, Vite fast-refresh düzgün işləsin.
 */

/** Yerli mutasiyaları uzaqdakılardan ayıran transaction mənşəyi. */
export const LOCAL_ORIGIN = 'flowboard-local';

export interface RoomContextValue {
  room: Room;
  undoManager: Y.UndoManager;
}

export const RoomContext = createContext<RoomContextValue | null>(null);

/** Cari otağa çıxış. `RoomProvider` daxilində çağırılmalıdır. */
export function useRoom(): RoomContextValue {
  const ctx = useContext(RoomContext);
  if (!ctx) {
    throw new Error('useRoom yalnız <RoomProvider> daxilində istifadə oluna bilər');
  }
  return ctx;
}

/**
 * Dərin müşahidə oluna bilən istənilən Yjs tipi üçün minimal struktur tip —
 * Y.Map<...> və Y.Array<...> arasındakı generik variansı yan keçir.
 */
interface DeepObservable {
  observeDeep(fn: () => void): void;
  unobserveDeep(fn: () => void): void;
}

/**
 * React state-ə birləşən köməkçi: verilmiş Yjs tipinin dəyişikliyinə abunə olur
 * və hər dəyişiklikdə artan version qaytarır (yenidən render tetikler).
 */
export function useForceUpdateOnChange(target: DeepObservable): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    target.observeDeep(bump);
    return () => target.unobserveDeep(bump);
  }, [target]);
  return version;
}
