import { useState } from 'react';
import { RoomProvider } from './collab/RoomProvider';
import { Canvas } from './canvas/Canvas';
import { Toolbar } from './ui/Toolbar';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { PresenceBar } from './ui/PresenceBar';
import { ShareButton } from './ui/ShareButton';
import { ThemeToggle } from './ui/ThemeToggle';
import { HistoryControls } from './ui/HistoryControls';
import { ZoomIndicator } from './ui/ZoomIndicator';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getRoomId } from './lib/room';

/**
 * Kök komponent. Otaq identifikatorunu URL-dən bir dəfə həll edir və bütün
 * tətbiqi <RoomProvider> ilə bükür ki, əməkdaşlıq hook-ları otağa çıxış əldə etsin.
 */
export default function App() {
  // Otaq id-si komponentin ömrü boyu sabit qalır (URL hash-indən).
  const [roomId] = useState(getRoomId);

  return (
    <RoomProvider roomId={roomId}>
      <Board />
    </RoomProvider>
  );
}

/** Kətan + bütün üzən UI qatlarını yerləşdirən daxili tərtibat. */
function Board() {
  // Qlobal qısayollar (RoomProvider daxilində olmalıdır).
  useKeyboardShortcuts();

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-2 text-content">
      {/* Render səthi — bütün fon. */}
      <Canvas />

      {/* Üst zolaq: brend + presence (sol), alətlər (orta), əməllər (sağ). */}
      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4">
        <div className="pointer-events-auto flex items-center gap-3">
          <Brand />
          <PresenceBar />
        </div>

        <div className="pointer-events-auto">
          <Toolbar />
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <HistoryControls />
          <div className="rounded-xl border border-border bg-surface p-1.5 shadow-panel">
            <ThemeToggle />
          </div>
          <ShareButton />
        </div>
      </header>

      {/* Sol panel: stil / seçim xüsusiyyətləri. */}
      <div className="pointer-events-none absolute left-4 top-24">
        <div className="pointer-events-auto">
          <PropertiesPanel />
        </div>
      </div>

      {/* Sol-alt: zoom göstəricisi. */}
      <div className="pointer-events-none absolute bottom-4 left-4">
        <div className="pointer-events-auto">
          <ZoomIndicator />
        </div>
      </div>

      {/* Sağ-alt: qısa istifadə ipucu. */}
      <div className="pointer-events-none absolute bottom-4 right-4 hidden max-w-xs rounded-lg border border-border bg-surface/80 px-3 py-2 text-xs text-content-muted shadow-panel backdrop-blur sm:block">
        Boş sahəni sürükləyərək hərəkət edin • Təkərlə yaxınlaşdırın • Formanı redaktə etmək üçün
        iki dəfə klikləyin
      </div>
    </div>
  );
}

/** FlowBoard loqosu və adı. */
function Brand() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 shadow-panel">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
        F
      </span>
      <span className="text-sm font-semibold text-content">FlowBoard</span>
    </div>
  );
}
