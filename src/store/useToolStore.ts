import { create } from 'zustand';
import type { Tool } from '../types';
import { PALETTE } from '../lib/colors';

/**
 * Aktiv alət və yeni formaların cari stil dəyərləri (yerli, sinxronlaşmır).
 * Bunlar per-user seçimlərdir — başqa istifadəçilər sizin aktiv alətinizi görmür.
 */
interface ToolState {
  tool: Tool;
  fill: string;
  stroke: string;
  strokeWidth: number;

  setTool: (tool: Tool) => void;
  setFill: (fill: string) => void;
  setStroke: (stroke: string) => void;
  setStrokeWidth: (width: number) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  tool: 'select',
  fill: PALETTE[0],
  stroke: PALETTE[8], // demək olar qara — vuruş üçün yaxşı defolt
  strokeWidth: 2,

  setTool: (tool) => set({ tool }),
  setFill: (fill) => set({ fill }),
  setStroke: (stroke) => set({ stroke }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
}));
