import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import { getSchema, type DocSchema } from './schema';

/**
 * Bir otaq üçün bütün real-vaxt infrastrukturu.
 *
 * İki provider eyni Y.Doc-a bağlanır:
 *   • WebrtcProvider     → peer-to-peer real-vaxt sinxronizasiyası (backend YOX)
 *   • IndexeddbPersistence → oflayn davamlılıq (brauzer bağlansa da iş qalır)
 *
 * y-webrtc seçilib ki, demo backend serveri olmadan işləsin: istifadəçilər
 * yalnız otaq URL-ini paylaşır və peer-lər signaling serverləri vasitəsilə tapışır.
 */
export interface Room {
  doc: Y.Doc;
  provider: WebrtcProvider;
  persistence: IndexeddbPersistence;
  schema: DocSchema;
  /** Bütün provider-ləri bağlayıb resursları təmizləyir. */
  destroy: () => void;
}

/** Public signaling serverləri — yalnız peer kəşfi üçün (məlumat P2P axır). */
const SIGNALING_SERVERS = [
  'wss://signaling.yjs.dev',
  'wss://y-webrtc-signaling-eu.herokuapp.com',
  'wss://y-webrtc-signaling-us.herokuapp.com',
];

/** IndexedDB açar toqquşmalarını önləmək üçün otaq adı prefiksi. */
const ROOM_PREFIX = 'flowboard-';

/**
 * Verilmiş roomId üçün otaq yaradır və bütün provider-ləri qoşur.
 * Hər səhifə yüklənməsində bir dəfə çağırılmalıdır.
 */
export function createRoom(roomId: string): Room {
  const doc = new Y.Doc();
  const roomName = `${ROOM_PREFIX}${roomId}`;

  // Oflayn davamlılıq — WebRTC-dən əvvəl qurulur ki, yerli iş dərhal yüklənsin.
  const persistence = new IndexeddbPersistence(roomName, doc);

  // Real-vaxt peer-to-peer sinxronizasiya.
  const provider = new WebrtcProvider(roomName, doc, {
    signaling: SIGNALING_SERVERS,
  });

  const schema = getSchema(doc);

  const destroy = () => {
    provider.destroy();
    persistence.destroy();
    doc.destroy();
  };

  return { doc, provider, persistence, schema, destroy };
}
