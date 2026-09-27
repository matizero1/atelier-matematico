/**
 * ═══════════════════════════════════════════════════════════════════
 * ATELIER MATEMÁTICO — CONTRATOS DE TIPOS DE MOTORES EN SILICIO
 * Definiciones formales para física computacional y renderizado 60 FPS
 * Gobernanza: Timonel F2 | Cero Falsas Aproximaciones
 * ═══════════════════════════════════════════════════════════════════
 */

export type EngineInitFn = () => void;
export type EngineStepFn = () => void;

export type PointerEventType = 'down' | 'move' | 'up' | 'hover';

export type PointerHandlerFn = (
  type: PointerEventType,
  x: number,
  y: number,
  dx: number,
  dy: number,
  artIdx: number
) => void;

export type PaletteCssFn = (factor: number) => string;
export type PaletteRgbFn = (factor: number) => [number, number, number];

export interface ArtworkEpistemology {
  category: 'A' | 'B' | 'C';
  tag: string;
  desc: string;
}

export interface Artwork {
  id: number;
  badge: string;
  epoch: number;
  epochName: string;
  year: string;
  author: string;
  title: string;
  sub: string;
  cat: string;
  eq: string;
  eqShort: string;
  metric: string;
  hist: string;
  poem: string;
  radius: number;
  theta: number;
  phi: number;
  archetype: string;
  pal: number;
  modelKey: string;
  epistemology: ArtworkEpistemology;
}

export interface EpochModule {
  epoch: number;
  name: string;
  range: [number, number];
  inits: Record<number, EngineInitFn>;
  steps: Record<number, EngineStepFn>;
  updateViewport: (
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D | null,
    pal?: number,
    palsCss?: PaletteCssFn[],
    palsRgb?: PaletteRgbFn[]
  ) => void;
  handlePointer?: PointerHandlerFn;
  setChladniModes?: (m: number, n: number) => void;
  getChladniModes?: () => { m: number; n: number };
}

export interface MathCoreContext {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  W: number;
  H: number;
  currentPal: number;
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  isDrag: boolean;
  dragX: number;
  dragY: number;
  PALS_RGB: PaletteRgbFn[];
  PALS_CSS: PaletteCssFn[];
  trailFade: (alpha?: number) => void;
  bindCanvas: (c: HTMLCanvasElement, width?: number, height?: number) => void;
  resize: (width?: number, height?: number) => void;
  setPalette: (pal: number) => void;
  getPalette: () => number;
  registerEpoch: (module: EpochModule) => void;
  notifyViewport: () => void;
  handlePointer: PointerHandlerFn;
}

export interface AtelierMathInterface {
  ARTWORKS: Artwork[];
  INITS: EngineInitFn[];
  STEPS: EngineStepFn[];
  bindCanvas: (canvas: HTMLCanvasElement, width?: number, height?: number) => void;
  resize: (width?: number, height?: number) => void;
  init: (idx: number) => void;
  step: (idx: number) => void;
  setPalette: (pal: number) => void;
  getPalette: () => number;
  setChladniModes: (m: number, n: number) => void;
  getChladniModes: () => { m: number; n: number };
  handlePointer: PointerHandlerFn;
  getEpochModule?: (epochId: number) => EpochModule | undefined;
}
