import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';

import { ShapeNode, ShapePrimitive } from './shapes/ShapeNode';
import { SelectionTransformer } from './SelectionTransformer';
import { CursorsLayer } from './CursorsLayer';
import { TextEditor } from './TextEditor';
import { useViewport } from './useViewport';

import { useBoard } from '../collab/useBoard';
import { useAwareness } from '../collab/useAwareness';
import { useToolStore } from '../store/useToolStore';
import { useViewportStore } from '../store/useViewportStore';
import { useSelectionStore } from '../store/useSelectionStore';
import { useUIStore } from '../store/useUIStore';
import { useCanvasApi } from '../store/useCanvasApi';
import { useWindowSize } from '../hooks/useWindowSize';

import { createShape, createArrow, createPen } from '../lib/shapes';
import type { Shape } from '../types';

/**
 * Əsas render səthi.
 *
 * Bütün göstərici (pointer) qarşılıqlı əməliyyatlarını idarə edir:
 *   • boş sahəni sürükləməklə pan, təkərlə zoom
 *   • aktiv alətlə formaların çəkilməsi (canlı "draft" forma ilə)
 *   • seçim + Transformer ilə ölçü/fırlanma
 *   • mətn/yapışqan qeyd redaktəsi (HTML overlay)
 *   • PNG ixracı (useCanvasApi vasitəsilə qeydiyyatdan keçir)
 *
 * Formalar Yjs-dən (useBoard) gəlir; viewport/alət/seçim yerli Zustand store-lardadır.
 */
export function Canvas() {
  const { width, height } = useWindowSize();
  const stageRef = useRef<Konva.Stage>(null);

  const { shapes, addShape, updateShape, removeShapes } = useBoard();
  const { others, setCursor } = useAwareness();
  const { handleWheel } = useViewport();

  const tool = useToolStore((s) => s.tool);
  const setTool = useToolStore((s) => s.setTool);
  const style = useToolStore((s) => ({
    fill: s.fill,
    stroke: s.stroke,
    strokeWidth: s.strokeWidth,
  }));

  const viewport = useViewportStore((s) => ({ x: s.x, y: s.y, scale: s.scale }));
  const setViewport = useViewportStore((s) => s.setViewport);

  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const select = useSelectionStore((s) => s.select);
  const toggle = useSelectionStore((s) => s.toggle);
  const clearSelection = useSelectionStore((s) => s.clear);

  const theme = useUIStore((s) => s.theme);
  const setExportPng = useCanvasApi((s) => s.setExportPng);

  // Çəkilməkdə olan (hələ Yjs-ə yazılmamış) forma.
  const [draft, setDraft] = useState<Shape | null>(null);
  const drawingRef = useRef<{ startX: number; startY: number } | null>(null);

  // Hazırda mətn redaktəsində olan formanın id-si.
  const [editingId, setEditingId] = useState<string | null>(null);

  // Transformer üçün canlı Konva node referansları.
  const nodesRef = useRef(new Map<string, Konva.Node>());
  const registerNode = useCallback((id: string, node: Konva.Node | null) => {
    if (node) nodesRef.current.set(id, node);
    else nodesRef.current.delete(id);
  }, []);

  // Göstəricinin altındakı dünya koordinatı (Stage transformunu nəzərə alır).
  const getWorldPoint = (): { x: number; y: number } | null => {
    const stage = stageRef.current;
    return stage ? stage.getRelativePointerPosition() : null;
  };

  // ---- Göstərici hadisələri -------------------------------------------------

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const world = getWorldPoint();
    if (!world) return;
    const clickedEmpty = e.target === e.target.getStage();

    if (tool === 'select') {
      // Boş sahəyə klik → seçimi təmizlə (pan Stage.draggable ilə olur).
      if (clickedEmpty) clearSelection();
      return;
    }

    // Mətn / yapışqan qeyd: dərhal yarat və redaktəyə keç.
    if (tool === 'text' || tool === 'sticky') {
      const base = createShape(tool, world.x, world.y, style);
      const shape = tool === 'text' ? { ...base, text: '' } : base;
      addShape(shape);
      select([shape.id]);
      setEditingId(shape.id);
      setTool('select');
      return;
    }

    // Sürükləyərək çəkilən formalar: draft başlat.
    drawingRef.current = { startX: world.x, startY: world.y };
    if (tool === 'arrow') setDraft(createArrow(world.x, world.y, style));
    else if (tool === 'pen') setDraft(createPen(world.x, world.y, style));
    else setDraft({ ...createShape(tool, world.x, world.y, style), width: 0, height: 0 } as Shape);
  };

  const handlePointerMove = () => {
    const world = getWorldPoint();
    if (!world) return;

    // Kursoru həmişə yayımlayırıq (dünya koordinatlarında).
    setCursor({ x: world.x, y: world.y });

    const start = drawingRef.current;
    if (!start || !draft) return;

    // Draft formanı canlı yeniləyirik.
    if (draft.type === 'rect' || draft.type === 'ellipse') {
      setDraft({
        ...draft,
        x: Math.min(start.startX, world.x),
        y: Math.min(start.startY, world.y),
        width: Math.abs(world.x - start.startX),
        height: Math.abs(world.y - start.startY),
      });
    } else if (draft.type === 'arrow') {
      setDraft({ ...draft, points: [0, 0, world.x - start.startX, world.y - start.startY] });
    } else if (draft.type === 'pen') {
      setDraft({
        ...draft,
        points: [...draft.points, world.x - draft.x, world.y - draft.y],
      });
    }
  };

  const handlePointerUp = () => {
    const start = drawingRef.current;
    drawingRef.current = null;
    if (!start || !draft) return;

    let final = draft;

    // Sürükləmə demək olar sıfırdırsa (sadə klik) → ağlabatan defolt ölçü ver.
    if (draft.type === 'rect' || draft.type === 'ellipse') {
      if (draft.width < 3 && draft.height < 3) {
        final = { ...draft, width: 120, height: draft.type === 'ellipse' ? 120 : 80 };
      }
    } else if (draft.type === 'arrow') {
      const [, , ex, ey] = draft.points;
      if (Math.abs(ex) < 3 && Math.abs(ey) < 3) final = { ...draft, points: [0, 0, 100, 0] };
    } else if (draft.type === 'pen' && draft.points.length < 4) {
      // Tək nöqtə — cizgi sayılmaz, atırıq.
      setDraft(null);
      return;
    }

    addShape(final);
    select([final.id]);
    setDraft(null);
    setTool('select');
  };

  // Boş kətanı sürükləmək pan edir → yeni viewport mövqeyini saxlayırıq.
  const handleStageDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (e.target === e.target.getStage()) {
      setViewport({ x: e.target.x(), y: e.target.y(), scale: viewport.scale });
    }
  };

  // ---- Seçim / dəyişiklik körpüləri ----------------------------------------

  const handleSelectShape = useCallback(
    (id: string, additive: boolean) => (additive ? toggle(id) : select([id])),
    [toggle, select],
  );

  const handleChangeShape = useCallback(
    (id: string, patch: Parameters<typeof updateShape>[1]) => updateShape(id, patch),
    [updateShape],
  );

  // ---- Mətn redaktəsi -------------------------------------------------------

  const editingShape = shapes.find((s) => s.id === editingId);

  const commitText = (text: string) => {
    if (!editingShape) return;
    // Boş mətn formaları faydasızdır → silirik.
    if (editingShape.type === 'text' && text.trim() === '') {
      removeShapes([editingShape.id]);
    } else {
      updateShape(editingShape.id, { text });
    }
    setEditingId(null);
  };

  const cancelText = () => {
    if (editingShape && editingShape.type === 'text' && editingShape.text.trim() === '') {
      removeShapes([editingShape.id]);
    }
    setEditingId(null);
  };

  // ---- PNG ixracı -----------------------------------------------------------

  const exportPng = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    clearSelection(); // Transformer tutacaqlarını gizlət
    // Bir kadr gözləyirik ki, Transformer detach olsun, sonra render alırıq.
    requestAnimationFrame(() => {
      const uri = stage.toDataURL({ pixelRatio: 2 });
      const img = new Image();
      img.onload = () => {
        // Şəffaf fonu tema rəngi ilə kompozisiya edirik.
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const link = document.createElement('a');
        link.download = 'flowboard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      img.src = uri;
    });
  }, [clearSelection, theme]);

  // İxrac funksiyasını qlobal API store-a qeyd edirik (Toolbar çağırır).
  useEffect(() => {
    setExportPng(exportPng);
    return () => setExportPng(null);
  }, [exportPng, setExportPng]);

  // Seçilmiş formaların canlı node-ları (Transformer üçün).
  const selectedNodes = selectedIds
    .map((id) => nodesRef.current.get(id) ?? null)
    .filter((n): n is Konva.Node => n !== null);

  const isDrawTool = tool !== 'select';

  return (
    <div
      className="absolute inset-0 board-grid"
      style={{ cursor: isDrawTool ? 'crosshair' : 'default' }}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        x={viewport.x}
        y={viewport.y}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        draggable={tool === 'select' && draft === null}
        onWheel={handleWheel}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchEnd={handlePointerUp}
        onDragEnd={handleStageDragEnd}
        onMouseLeave={() => setCursor(null)}
      >
        <Layer>
          {shapes.map((shape) => (
            <ShapeNode
              key={shape.id}
              shape={shape}
              isSelected={selectedIds.includes(shape.id)}
              registerNode={registerNode}
              onSelect={handleSelectShape}
              onChange={handleChangeShape}
              onStartEdit={setEditingId}
              isEditing={shape.id === editingId}
            />
          ))}

          {/* Çəkilməkdə olan draft forma (interaktiv deyil). */}
          {draft && (
            <Group x={draft.x} y={draft.y} listening={false} opacity={0.8}>
              <ShapePrimitive shape={draft} isSelected={false} />
            </Group>
          )}

          {/* Seçim tutacaqları — redaktə/çəkmə zamanı gizli. */}
          {!editingId && draft === null && <SelectionTransformer nodes={selectedNodes} />}
        </Layer>

        <CursorsLayer others={others} scale={viewport.scale} />
      </Stage>

      {/* Mətn/yapışqan qeyd redaktoru (kətanın üzərində HTML overlay). */}
      {editingShape && (editingShape.type === 'text' || editingShape.type === 'sticky') && (
        <TextEditor
          shape={editingShape}
          viewport={viewport}
          onCommit={commitText}
          onCancel={cancelText}
        />
      )}
    </div>
  );
}
