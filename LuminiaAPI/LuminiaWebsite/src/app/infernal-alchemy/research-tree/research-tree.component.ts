import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { GridPoint, ResearchNode, ResearchParent, researchTree } from './research-tree.data';
import { PotionView, describePotion, upgradeCosts } from './potions';

type NodeState = 'unlocked' | 'available' | 'locked';
type EdgeState = 'done' | 'open' | 'partial' | 'locked';

// Where lines overlap (hubs share their first stretch), the higher state is drawn on top
const EDGE_ORDER: Record<EdgeState, number> = { locked: 0, partial: 1, open: 2, done: 3 };

interface NodeView {
  node: ResearchNode;
  x: number;
  y: number;
  state: NodeState;
  labelLines: string[];
  labelY: number;
  icon: string;
  requires: string;
  /** What the potion does, for potion nodes that have a description. */
  potion: PotionView | null;
  /** What an upgrade adds to brewing each potion (ingredients only, no prices). */
  brewing: string[];
}

interface EdgeView {
  d: string;
  state: EdgeState;
  secondary: boolean;
}

interface BadgeView {
  x: number;
  y: number;
  cost: number;
  state: EdgeState;
}

// Grid cell size and outer padding in SVG units
const UX = 104;
const UY = 120;
const PAD_X = 64;
const PAD_Y = 76;
const HEX_R = 24;
const MAJOR = 52;
const LABEL_CHARS = 17;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2.5;
const EDGE_MARGIN = 60;

@Component({
  selector: 'app-research-tree',
  templateUrl: './research-tree.component.html',
  styleUrls: ['./research-tree.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ResearchTreeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('viewport') viewportRef!: ElementRef<HTMLDivElement>;
  @ViewChild('world') worldRef!: ElementRef<SVGGElement>;

  readonly hexPoints = hexagon(HEX_R);
  readonly hexPointsOuter = hexagon(HEX_R + 4);
  readonly major = MAJOR;

  nodes: NodeView[] = [];
  edges: EdgeView[] = [];
  badges: BadgeView[] = [];
  arrows: EdgeView[] = [];
  width = 0;
  height = 0;
  selected: NodeView | null = null;
  /** True until the unlocked nodes have been loaded. */
  loading = true;

  private view = { x: 0, y: 0, k: 1 };
  private pointers = new Map<number, { x: number, y: number }>();
  private gesture: { x: number, y: number, k: number, midX: number, midY: number, dist: number } | null = null;
  private moved = 0;
  private downTarget: Element | null = null;
  private userMoved = false;
  private resizeObserver?: ResizeObserver;

  /** Ids of the unlocked nodes (from the database); null while they're still loading. */
  @Input() set unlocked(value: ReadonlySet<string> | null) {
    this.loading = value === null;
    const selectedId = this.selected?.node.id;
    this.build(value ?? new Set());
    this.selected = this.nodes.find(n => n.node.id === selectedId) ?? null;
  }

  constructor() {
    this.build(new Set());
  }

  ngAfterViewInit(): void {
    this.fit();
    this.resizeObserver = new ResizeObserver(() => { if (!this.userMoved) this.fit(); });
    this.resizeObserver.observe(this.viewportRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  // ---- Building the view model ----

  private build(unlocked: ReadonlySet<string>): void {
    this.nodes = [];
    this.edges = [];
    this.badges = [];
    this.arrows = [];
    const byId = new Map(researchTree.map(n => [n.id, n]));
    const parentsOf = (n: ResearchNode) => (n.parents ?? []).map(p => typeof p === 'string' ? { from: p } as ResearchParent : p);
    const state = (n: ResearchNode): NodeState =>
      unlocked.has(n.id) ? 'unlocked'
        : parentsOf(n).every(p => unlocked.has(p.from)) ? 'available' : 'locked';
    const px = (col: number) => PAD_X + col * UX;
    const py = (row: number) => PAD_Y + row * UY;

    const states = new Map(researchTree.map(n => [n.id, state(n)]));

    for (const n of researchTree) {
      const nodeState = states.get(n.id)!;
      const parents = parentsOf(n);

      parents.forEach((p, i) => {
        const from = byId.get(p.from);
        if (!from) {
          console.warn(`Research tree: "${n.id}" has unknown parent "${p.from}"`);
          return;
        }
        const points = route(from, n, p).map(([c, r]) => [px(c), py(r)] as const);
        const edgeState: EdgeState = nodeState === 'unlocked' ? 'done'
          : unlocked.has(from.id) ? (nodeState === 'available' ? 'open' : 'partial') : 'locked';
        this.edges.push({ d: 'M' + points.map(([x, y]) => `${x},${y}`).join(' L'), state: edgeState, secondary: i > 0 && !p.thick });

        if (i === 0 && n.cost) {
          const [bx, by] = n.badge
            ? [px(n.badge[0]), py(n.badge[1])]
            : midpoint(points[points.length - 2], points[points.length - 1]);
          this.badges.push({ x: bx, y: by, cost: n.cost, state: edgeState });
        }
      });

      const x = px(n.col);
      const y = py(n.row);
      if (n.continues) {
        const x1 = x + (n.major ? MAJOR / 2 : HEX_R);
        const x2 = x + UX * 0.85;
        this.arrows.push({ d: `M${x1},${y} L${x2},${y} M${x2 - 12},${y - 12} L${x2},${y} L${x2 - 12},${y + 12}`, state: nodeState === 'unlocked' ? 'open' : 'locked', secondary: false });
      }

      const labelLines = wrap(n.label, LABEL_CHARS);
      const potion = n.major ? describePotion(n.id, unlocked) : null;
      // Relative to the node's centre: the label sits above it, growing upwards
      const top = -(n.major ? MAJOR / 2 : HEX_R) - 8;
      this.nodes.push({
        node: n, x, y, state: nodeState, labelLines,
        labelY: top - (labelLines.length - 1) * 11,
        icon: `assets/images/infernal-alchemy/research/${n.icon}`,
        requires: parents.map(p => byId.get(p.from)?.label ?? p.from).join(' & '),
        potion,
        brewing: upgradeCosts(n)
      });
    }

    this.edges.sort((a, b) => EDGE_ORDER[a.state] - EDGE_ORDER[b.state]);

    this.width = PAD_X * 2 + Math.max(...researchTree.map(n => n.col + (n.continues ? 1 : 0))) * UX;
    this.height = PAD_Y + Math.max(...researchTree.map(n => n.row)) * UY + 56;
  }

  // ---- Selection ----

  select(view: NodeView | null): void {
    this.selected = this.selected === view ? null : view;
  }

  onNodeKey(event: KeyboardEvent, view: NodeView): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(view);
    }
  }

  // ---- Pan & zoom ----

  zoomBy(factor: number): void {
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    this.zoomAt(this.view.k * factor, rect.width / 2, rect.height / 2);
  }

  fit(): void {
    const vp = this.viewportRef.nativeElement;
    const k = clamp(vp.clientWidth / this.width, 0.55, 1);
    this.userMoved = false;
    // Centre when it fits; otherwise start at the left so the starting potions are in view
    this.apply({ x: Math.max(0, (vp.clientWidth - this.width * k) / 2), y: 0, k });
  }

  onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.viewportRef.nativeElement.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 1) {
      this.moved = 0;
      this.downTarget = event.target as Element;
    }
    this.startGesture();
  }

  onPointerMove(event: PointerEvent): void {
    const last = this.pointers.get(event.pointerId);
    if (!last || !this.gesture) return;
    this.moved += Math.abs(event.clientX - last.x) + Math.abs(event.clientY - last.y);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const { midX, midY, dist } = this.measure();
    const g = this.gesture;
    const k = this.pointers.size > 1 && g.dist > 0 ? clamp(g.k * dist / g.dist, MIN_ZOOM, MAX_ZOOM) : g.k;
    // Keep the world point that was under the gesture's start midpoint under the current midpoint
    const worldX = (g.midX - g.x) / g.k;
    const worldY = (g.midY - g.y) / g.k;
    this.userMoved = true;
    this.apply({ x: midX - worldX * k, y: midY - worldY * k, k });
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.pointers.delete(event.pointerId)) return;
    if (this.pointers.size === 0) {
      this.gesture = null;
      if (event.type === 'pointerup' && this.moved < 6) {
        const id = this.downTarget?.closest('[data-node]')?.getAttribute('data-node');
        const hit = id ? this.nodes.find(n => n.node.id === id) ?? null : null;
        if (hit || this.selected) this.select(hit ?? this.selected);
      }
    } else {
      this.startGesture();
    }
  }

  onWheel(event: WheelEvent): void {
    // Plain scrolling keeps scrolling the page; ctrl/cmd + wheel (and trackpad pinch) zooms
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    this.zoomAt(this.view.k * Math.exp(-event.deltaY * 0.0025), event.clientX - rect.left, event.clientY - rect.top);
  }

  private zoomAt(k: number, cx: number, cy: number): void {
    k = clamp(k, MIN_ZOOM, MAX_ZOOM);
    const { x, y, k: k0 } = this.view;
    this.userMoved = true;
    this.apply({ x: cx - (cx - x) * k / k0, y: cy - (cy - y) * k / k0, k });
  }

  private startGesture(): void {
    this.gesture = { ...this.view, ...this.measure() };
  }

  private measure(): { midX: number, midY: number, dist: number } {
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    const pts = [...this.pointers.values()];
    const midX = pts.reduce((s, p) => s + p.x, 0) / pts.length - rect.left;
    const midY = pts.reduce((s, p) => s + p.y, 0) / pts.length - rect.top;
    const dist = pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0;
    return { midX, midY, dist };
  }

  private apply(next: { x: number, y: number, k: number }): void {
    const vp = this.viewportRef.nativeElement;
    const w = this.width * next.k;
    const h = this.height * next.k;
    // Content can be dragged at most EDGE_MARGIN past the viewport edges
    const clampAxis = (v: number, size: number, content: number) =>
      clamp(v, Math.min(EDGE_MARGIN, size - content - EDGE_MARGIN), Math.max(EDGE_MARGIN, size - content - EDGE_MARGIN));
    this.view = { x: clampAxis(next.x, vp.clientWidth, w), y: clampAxis(next.y, vp.clientHeight, h), k: next.k };
    this.worldRef.nativeElement.setAttribute('transform', `translate(${this.view.x},${this.view.y}) scale(${this.view.k})`);
  }
}

function route(from: ResearchNode, to: ResearchNode, parent: ResearchParent): GridPoint[] {
  const start: GridPoint = [from.col, from.row];
  const end: GridPoint = [to.col, to.row];
  if (parent.via) return [start, ...parent.via, end];
  if (parent.bus !== undefined) return [start, [parent.bus, from.row], [parent.bus, to.row], end];
  if (from.row === to.row || from.col === to.col) return [start, end];
  return [start, [to.col, from.row], end];
}

function midpoint(a: readonly [number, number], b: readonly [number, number]): [number, number] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function hexagon(r: number): string {
  return [-90, -30, 30, 90, 150, 210]
    .map(deg => deg * Math.PI / 180)
    .map(a => `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`)
    .join(' ');
}

function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  for (const word of text.split(' ')) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + word).length <= max) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
  }
  return lines;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
