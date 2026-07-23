import { useCallback, useEffect, useState } from 'react';
import { useRoom } from './roomContext';

/**
 * `Y.UndoManager` üzərində geri/yenidən idarəetməsi.
 *
 * UndoManager yalnız `LOCAL_ORIGIN` transaction-larını izlədiyi üçün
 * (bax: RoomContext), istifadəçi yalnız ÖZ dəyişikliklərini geri qaytarır —
 * real-vaxt əməkdaşlıqda kritik davranış.
 */
export function useHistory() {
  const { undoManager } = useRoom();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Yığın hər dəyişdikdə düymələrin aktiv/passiv vəziyyətini yeniləyirik.
  useEffect(() => {
    const update = () => {
      setCanUndo(undoManager.canUndo());
      setCanRedo(undoManager.canRedo());
    };
    update();
    undoManager.on('stack-item-added', update);
    undoManager.on('stack-item-popped', update);
    // `stack-cleared` bəzi Yjs versiyalarında var — təhlükəsizlik üçün əlavə edirik.
    return () => {
      undoManager.off('stack-item-added', update);
      undoManager.off('stack-item-popped', update);
    };
  }, [undoManager]);

  const undo = useCallback(() => undoManager.undo(), [undoManager]);
  const redo = useCallback(() => undoManager.redo(), [undoManager]);

  return { undo, redo, canUndo, canRedo };
}
