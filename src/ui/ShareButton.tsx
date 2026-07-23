import { useState } from 'react';
import { ShareIcon, CheckIcon } from './icons';

/**
 * Cari otaq URL-ini panoya kopyalayır. URL-də otaq identifikatoru olduğundan,
 * onu paylaşmaq başqalarını eyni real-vaxt lövhəyə dəvət edir.
 */
export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Panoya çıxış yoxdursa (məs. HTTP), istifadəçiyə URL-i seçməyi göstəririk.
      window.prompt('Bu otaq linkini kopyalayın:', window.location.href);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {copied ? <CheckIcon width={16} height={16} /> : <ShareIcon width={16} height={16} />}
      {copied ? 'Kopyalandı!' : 'Paylaş'}
    </button>
  );
}
