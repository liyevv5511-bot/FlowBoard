import { useAwareness } from '../collab/useAwareness';

/** Adın baş hərflərini (avatar üçün) qaytarır — məs. "Cəld Tülkü" → "CT". */
function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Otaqdakı canlı istifadəçiləri (özün + başqaları) rəngli avatarlar kimi göstərir.
 * `useAwareness` presence dəyişdikcə avtomatik yenilənir.
 */
export function PresenceBar() {
  const { self, others } = useAwareness();
  const everyone = [self, ...others.map((o) => o.user)];

  return (
    <div className="flex items-center -space-x-2">
      {everyone.map((user, i) => (
        <div
          key={user.id}
          title={i === 0 ? `${user.name} (siz)` : user.name}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface text-xs font-semibold text-white"
          style={{ backgroundColor: user.color, zIndex: everyone.length - i }}
        >
          {initials(user.name)}
        </div>
      ))}
    </div>
  );
}
