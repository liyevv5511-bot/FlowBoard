import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import * as Y from 'yjs';
import { createRoom, type Room } from './doc';
import { RoomContext, LOCAL_ORIGIN } from './roomContext';

/**
 * Otağı (Y.Doc + provider-lər + UndoManager) React ağacına təqdim edir.
 *
 * Bütün mutasiyalar `LOCAL_ORIGIN` ilə transaction-a bükülür (bax: useBoard)
 * ki, UndoManager yalnız CARİ istifadəçinin dəyişikliklərini geri qaytarsın —
 * başqasının işini pozmadan.
 */
interface RoomProviderProps {
  roomId: string;
  children: ReactNode;
}

export function RoomProvider({ roomId, children }: RoomProviderProps) {
  // Otağı yalnız bir dəfə yaradırıq — ref render-lər arası sabit saxlayır.
  const roomRef = useRef<Room | null>(null);
  if (roomRef.current === null) {
    roomRef.current = createRoom(roomId);
  }
  const room = roomRef.current;

  const undoManager = useMemo(
    () =>
      new Y.UndoManager([room.schema.shapes, room.schema.order], {
        trackedOrigins: new Set([LOCAL_ORIGIN]),
      }),
    [room],
  );

  // Komponent ağacı söküləndə bütün şəbəkə/DB resurslarını təmizləyirik.
  useEffect(() => {
    return () => {
      undoManager.destroy();
      room.destroy();
    };
  }, [room, undoManager]);

  const value = useMemo(() => ({ room, undoManager }), [room, undoManager]);

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
