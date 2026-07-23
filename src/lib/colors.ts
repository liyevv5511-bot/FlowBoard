/**
 * Rəng köməkçiləri: forma palitrası + hər istifadəçiyə sabit presence rəngi.
 */

/** Alətlər panelindəki forma doldurma/vuruş palitrası. */
export const PALETTE = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#ef4444', // red
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#1f2937', // slate-800 (demək olar qara)
  '#ffffff', // ağ
] as const;

/** Yapışqan qeydlər üçün yumşaq pastel rənglər. */
export const STICKY_COLORS = [
  '#fef08a', // sarı
  '#bbf7d0', // yaşıl
  '#bfdbfe', // mavi
  '#fbcfe8', // çəhrayı
  '#fed7aa', // narıncı
] as const;

/** Canlı kursorlar üçün canlı, fərqlənən rənglər. */
const CURSOR_COLORS = [
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

/**
 * Verilmiş sədaqətli (deterministik) toxumdan sabit kursor rəngi seçir —
 * beləliklə eyni istifadəçi hər zaman eyni rəngi alır.
 */
export function pickCursorColor(seed: number): string {
  const index = Math.abs(Math.floor(seed)) % CURSOR_COLORS.length;
  return CURSOR_COLORS[index];
}
