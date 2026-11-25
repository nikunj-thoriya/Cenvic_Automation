// Generates each documentation/DFD/<Type>/<type>-dfd.html from the matching <type>-dfd.json (the source of truth).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type NodeType = 'entity' | 'process' | 'store';
type Point = [number, number];

interface DfdNode {
  id: string;
  type: NodeType;
  label: string;
  number?: string;
  col: number;
  row: number;
  derived?: boolean;
}

interface DfdFlow {
  from: string;
  to: string;
  label: string;
  derived?: boolean;
  via?: Point[];
  at?: number;
}

interface Diagram {
  id: string;
  level: string;
  title: string;
  description: string;
  nodes: DfdNode[];
  flows: DfdFlow[];
  notes?: string[];
}

interface DfdSource {
  project: string;
  title: string;
  dfdType: string;
  version: string;
  lastUpdated: string;
  scope: string[];
  note: string;
  notation: string;
  sources: string[];
  diagrams: Diagram[];
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets: [string, string][] = [
  ['UI-Based', 'ui-based-dfd'],
  ['API-Based', 'api-based-dfd'],
  ['Database-Level', 'database-level-dfd'],
  ['Complete-System', 'complete-system-dfd'],
];

const COL_PITCH = 460;
const ROW_PITCH = 165;
const NODE_W = 200;
const NODE_H = 76;
const PAD = 40;

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/)) {
    if (current && (current + ' ' + word).length > max) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const cx = (col: number): number => PAD + NODE_W / 2 + col * COL_PITCH;
const cy = (row: number): number => PAD + NODE_H / 2 + row * ROW_PITCH;

function exitPoint(from: Point, toward: Point, center: Point): Point {
  const dx = toward[0] - from[0];
  const dy = toward[1] - from[1];
  const tx =
    dx > 0 ? (center[0] + NODE_W / 2 - from[0]) / dx : dx < 0 ? (center[0] - NODE_W / 2 - from[0]) / dx : Infinity;
  const ty =
    dy > 0 ? (center[1] + NODE_H / 2 - from[1]) / dy : dy < 0 ? (center[1] - NODE_H / 2 - from[1]) / dy : Infinity;
  const t = Math.min(tx, ty);
  return [from[0] + dx * t, from[1] + dy * t];
}

function validate(source: DfdSource, file: string): void {
  for (const d of source.diagrams) {
    const ids = new Set<string>();
    for (const n of d.nodes) {
      if (ids.has(n.id)) throw new Error(`${file}: ${d.id} has duplicate node ${n.id}.`);
      ids.add(n.id);
      if ((n.type === 'process' || n.type === 'store') && !n.number)
        throw new Error(`${file}: ${d.id} ${n.id} needs a number.`);
    }
    for (const f of d.flows) {
      if (!ids.has(f.from) || !ids.has(f.to))
        throw new Error(`${file}: ${d.id} flow "${f.label}" uses an unknown node.`);
    }
  }
}

function nodeSvg(n: DfdNode): string {
  const x = cx(n.col) - NODE_W / 2;
  const y = cy(n.row) - NODE_H / 2;
  const dash = n.derived ? ' stroke-dasharray="6 4"' : '';
  const cls = `node ${n.type}`;
  const textLines = (lines: string[], tx: number, ty: number, anchor: string): string => {
    const start = ty - ((lines.length - 1) * 15) / 2;
    return lines
      .map((l, i) => `<text x="${tx}" y="${start + i * 15 + 4}" text-anchor="${anchor}">${escapeHtml(l)}</text>`)
      .join('');
  };
  if (n.type === 'entity') {
    return `<g class="${cls}"><rect x="${x}" y="${y}" width="${NODE_W}" height="${NODE_H}"${dash}/>${textLines(wrap(n.label, 26).slice(0, 4), x + NODE_W / 2, y + NODE_H / 2, 'middle')}</g>`;
  }
  if (n.type === 'process') {
    const lines = wrap(n.label, 26).slice(0, 3);
    return `<g class="${cls}"><rect x="${x}" y="${y}" width="${NODE_W}" height="${NODE_H}" rx="12"${dash}/><line x1="${x}" y1="${y + 22}" x2="${x + NODE_W}" y2="${y + 22}"/><text class="num" x="${x + NODE_W / 2}" y="${y + 16}" text-anchor="middle">${escapeHtml(n.number ?? '')}</text>${textLines(lines, x + NODE_W / 2, y + 22 + (NODE_H - 22) / 2, 'middle')}</g>`;
  }
  const lines = wrap(n.label, 20).slice(0, 3);
  return `<g class="${cls}"><line x1="${x}" y1="${y}" x2="${x + NODE_W}" y2="${y}"${dash}/><line x1="${x}" y1="${y + NODE_H}" x2="${x + NODE_W}" y2="${y + NODE_H}"${dash}/><line x1="${x}" y1="${y}" x2="${x}" y2="${y + NODE_H}"${dash}/><line x1="${x + 44}" y1="${y}" x2="${x + 44}" y2="${y + NODE_H}"/><text class="num" x="${x + 22}" y="${y + NODE_H / 2 + 4}" text-anchor="middle">${escapeHtml(n.number ?? '')}</text>${textLines(lines, x + 44 + (NODE_W - 44) / 2, y + NODE_H / 2, 'middle')}</g>`;
}

function diagramSvg(d: Diagram): string {
  const nodeById = new Map(d.nodes.map((n) => [n.id, n]));
  const center = (n: DfdNode): Point => [cx(n.col), cy(n.row)];
  const groups = new Map<string, number[]>();
  d.flows.forEach((f, i) => {
    if (f.via) return;
    const key = [f.from, f.to].sort().join('|');
    groups.set(key, [...(groups.get(key) ?? []), i]);
  });

  const paths: string[] = [];
  const labels: string[] = [];
  const geometry: { pts: Point[]; at: number }[] = [];
  d.flows.forEach((f, i) => {
    const a = nodeById.get(f.from) as DfdNode;
    const b = nodeById.get(f.to) as DfdNode;
    const ca = center(a);
    const cb = center(b);
    let pts: Point[];
    const at = f.at ?? 0.5;
    if (f.via) {
      const vias = f.via.map((v): Point => [cx(v[0]), cy(v[1])]);
      const first = vias[0] as Point;
      const last = vias[vias.length - 1] as Point;
      pts = [exitPoint(ca, first, ca), ...vias, exitPoint(cb, last, cb)];
    } else {
      const key = [f.from, f.to].sort().join('|');
      const group = groups.get(key) as number[];
      const n = group.length;
      const idx = group.indexOf(i);
      const [lo, hi] = [f.from, f.to].sort() as [string, string];
      const lc = center(nodeById.get(lo) as DfdNode);
      const hc = center(nodeById.get(hi) as DfdNode);
      const len = Math.hypot(hc[0] - lc[0], hc[1] - lc[1]) || 1;
      const nx = -(hc[1] - lc[1]) / len;
      const ny = (hc[0] - lc[0]) / len;
      const offset = n > 1 ? (idx - (n - 1) / 2) * 40 : 0;
      const p1: Point = [ca[0] + nx * offset, ca[1] + ny * offset];
      const p2: Point = [cb[0] + nx * offset, cb[1] + ny * offset];
      pts = [exitPoint(p1, p2, ca), exitPoint(p2, p1, cb)];
    }
    const dash = f.derived ? ' stroke-dasharray="6 4"' : '';
    paths.push(
      `<polyline class="flow" points="${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}" marker-end="url(#arr-${d.id})"${dash}/>`,
    );
    geometry.push({ pts, at });
  });

  const positionAt = (pts: Point[], fraction: number): Point => {
    const seg: number[] = [];
    let total = 0;
    for (let k = 1; k < pts.length; k++) {
      const p = pts[k - 1] as Point;
      const q = pts[k] as Point;
      const l = Math.hypot(q[0] - p[0], q[1] - p[1]);
      seg.push(l);
      total += l;
    }
    let remain = total * fraction;
    for (let k = 0; k < seg.length; k++) {
      const l = seg[k] as number;
      if (remain <= l || k === seg.length - 1) {
        const p = pts[k] as Point;
        const q = pts[k + 1] as Point;
        const t = l === 0 ? 0 : Math.min(1, remain / l);
        return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      }
      remain -= l;
    }
    return pts[0] as Point;
  };

  type Box = [number, number, number, number];
  const overlaps = (a: Box, b: Box): boolean =>
    a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];
  const taken: Box[] = d.nodes.map((n): Box => [
    cx(n.col) - NODE_W / 2 - 4,
    cy(n.row) - NODE_H / 2 - 4,
    NODE_W + 8,
    NODE_H + 8,
  ]);

  const samples = geometry.map(({ pts }) => {
    const out: Point[] = [];
    for (let k = 1; k < pts.length; k++) {
      const p = pts[k - 1] as Point;
      const q = pts[k] as Point;
      const steps = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / 6));
      for (let s = 0; s <= steps; s++)
        out.push([p[0] + ((q[0] - p[0]) * s) / steps, p[1] + ((q[1] - p[1]) * s) / steps]);
    }
    return out;
  });
  const lineHits = (box: Box, own: number): number =>
    samples.reduce(
      (sum, pts, idx) =>
        idx === own
          ? sum
          : sum +
            pts.filter((p) => p[0] > box[0] && p[0] < box[0] + box[2] && p[1] > box[1] && p[1] < box[1] + box[3])
              .length,
      0,
    );

  d.flows.forEach((f, i) => {
    const { pts, at } = geometry[i] as { pts: Point[]; at: number };
    const lines = wrap(`F${i + 1} ${f.label}`, 22).slice(0, 4);
    const w = Math.max(...lines.map((l) => l.length)) * 6.8 + 14;
    const h = lines.length * 14 + 6;
    const candidates = [at];
    for (let step = 1; step <= 25; step++) candidates.push(at + step * 0.03, at - step * 0.03);
    let chosen: Box | undefined;
    let best = Infinity;
    for (const t of candidates) {
      if (t < 0.12 || t > 0.88) continue;
      const pos = positionAt(pts, t);
      const box: Box = [pos[0] - w / 2, pos[1] - h / 2, w, h];
      const cost =
        (taken.some((other) => overlaps(box, other)) ? 100000 : 0) + lineHits(box, i) * 4 + Math.abs(t - at) * 20;
      if (cost < best) {
        best = cost;
        chosen = box;
      }
    }
    if (!chosen) {
      const pos = positionAt(pts, at);
      chosen = [pos[0] - w / 2, pos[1] - h / 2, w, h];
    }
    taken.push([chosen[0] - 2, chosen[1] - 2, chosen[2] + 4, chosen[3] + 4]);
    const mid = chosen[0] + w / 2;
    labels.push(
      `<g class="label"><rect x="${chosen[0].toFixed(1)}" y="${chosen[1].toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="3"/>${lines
        .map(
          (l, k) =>
            `<text x="${mid.toFixed(1)}" y="${(chosen[1] + 14 + k * 14 - 2).toFixed(1)}" text-anchor="middle">${escapeHtml(l)}</text>`,
        )
        .join('')}</g>`,
    );
  });

  const maxCol = Math.max(...d.nodes.map((n) => n.col));
  const maxRow = Math.max(...d.nodes.map((n) => n.row));
  const width = PAD * 2 + NODE_W + maxCol * COL_PITCH;
  const height = PAD * 2 + NODE_H + maxRow * ROW_PITCH;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(d.title)}" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="arr-${d.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#334e68"/></marker></defs>
${paths.join('\n')}
${d.nodes.map(nodeSvg).join('\n')}
${labels.join('\n')}
</svg>`;
}

const typeName: Record<NodeType, string> = { entity: 'External entity', process: 'Process', store: 'Data store' };

function diagramSection(d: Diagram): string {
  const nodeById = new Map(d.nodes.map((n) => [n.id, n]));
  const name = (id: string): string => {
    const n = nodeById.get(id) as DfdNode;
    return n.number ? `${n.number} ${n.label}` : n.label;
  };
  const evidence = (derived?: boolean): string => (derived ? 'Derived' : 'Confirmed');
  const elementRows = d.nodes
    .map(
      (n) => `<tr><td>${escapeHtml(name(n.id))}</td><td>${typeName[n.type]}</td><td>${evidence(n.derived)}</td></tr>`,
    )
    .join('\n');
  const flowRows = d.flows
    .map(
      (f, i) =>
        `<tr><td>F${i + 1}</td><td>${escapeHtml(name(f.from))}</td><td>${escapeHtml(name(f.to))}</td><td>${escapeHtml(f.label)}</td><td>${evidence(f.derived)}</td></tr>`,
    )
    .join('\n');
  const notes = d.notes?.length ? `<ul>${d.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join('')}</ul>` : '';
  return `<section id="${d.id}">
<h2>${escapeHtml(d.id)} — ${escapeHtml(d.title)} <span class="level">Level ${escapeHtml(d.level)}</span></h2>
<p>${escapeHtml(d.description)}</p>
<div class="diagram">${diagramSvg(d)}</div>
${notes}
<details><summary>Data flows (${d.flows.length}) and elements (${d.nodes.length})</summary>
<table><thead><tr><th>Flow</th><th>From</th><th>To</th><th>Data</th><th>Evidence</th></tr></thead><tbody>
${flowRows}
</tbody></table>
<table><thead><tr><th>Element</th><th>Type</th><th>Evidence</th></tr></thead><tbody>
${elementRows}
</tbody></table>
</details>
</section>`;
}

const legendSvg = `<svg viewBox="0 0 760 120" role="img" aria-label="Legend" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="arr-legend" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#334e68"/></marker></defs>
<g class="node entity"><rect x="10" y="10" width="140" height="44"/><text x="80" y="36" text-anchor="middle">External entity</text></g>
<g class="node process"><rect x="170" y="10" width="140" height="44" rx="10"/><line x1="170" y1="26" x2="310" y2="26"/><text class="num" x="240" y="22" text-anchor="middle">1.0</text><text x="240" y="43" text-anchor="middle">Process</text></g>
<g class="node store"><line x1="330" y1="10" x2="470" y2="10"/><line x1="330" y1="54" x2="470" y2="54"/><line x1="330" y1="10" x2="330" y2="54"/><line x1="360" y1="10" x2="360" y2="54"/><text class="num" x="345" y="36" text-anchor="middle">D1</text><text x="415" y="36" text-anchor="middle">Data store</text></g>
<polyline class="flow" points="500,32 600,32" marker-end="url(#arr-legend)"/><text x="550" y="22" text-anchor="middle" class="legend-text">Data flow (Fn)</text>
<polyline class="flow" points="620,32 740,32" stroke-dasharray="6 4" marker-end="url(#arr-legend)"/><text x="680" y="22" text-anchor="middle" class="legend-text">Derived flow</text>
<g class="node entity"><rect x="10" y="70" width="140" height="40" stroke-dasharray="6 4"/><text x="80" y="94" text-anchor="middle">Derived element</text></g>
</svg>`;

const css = `
  body { font-family: Segoe UI, Arial, sans-serif; margin: 0; background: #f5f7fa; color: #1f2933; }
  header { background: #1f3a5f; color: #fff; padding: 16px 24px; }
  header h1 { margin: 0; font-size: 22px; }
  header p { margin: 4px 0 0; font-size: 13px; opacity: 0.85; }
  main { padding: 16px 24px; }
  section { background: #fff; border: 1px solid #d9e2ec; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px; }
  h2 { font-size: 16px; margin: 0 0 8px; }
  .level { font-size: 12px; background: #e3ecfa; border-radius: 3px; padding: 2px 8px; margin-left: 8px; font-weight: 500; }
  .note { background: #fff3cd; border: 1px solid #ffeeba; color: #533f03; border-radius: 4px; padding: 8px 12px; font-size: 13px; }
  .diagram { overflow-x: auto; border: 1px solid #e4e7eb; border-radius: 4px; background: #fff; }
  .diagram svg { width: 100%; height: auto; min-width: 760px; }
  svg text { font-family: Segoe UI, Arial, sans-serif; font-size: 12.5px; fill: #1f2933; }
  svg .num { font-weight: 600; font-size: 12px; }
  svg .legend-text { font-size: 11px; }
  .node rect, .node line { stroke: #334e68; stroke-width: 1.5; }
  .entity rect { fill: #fff7d6; }
  .process rect { fill: #dbeafe; }
  .store line { fill: none; }
  .flow { fill: none; stroke: #334e68; stroke-width: 1.5; }
  .label rect { fill: #fff; fill-opacity: 0.94; }
  .label text { font-size: 11.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0; }
  th, td { border: 1px solid #d9e2ec; padding: 5px 8px; text-align: left; vertical-align: top; }
  th { background: #eef2f7; }
  summary { cursor: pointer; font-size: 13px; font-weight: 500; margin-top: 8px; }
  ul { margin: 4px 0; padding-left: 20px; font-size: 13px; }
  nav ol { columns: 2; font-size: 13px; }
  a { color: #1f4e8c; }
`;

function istNow(): string {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())} ${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())} IST`;
}

function render(source: DfdSource): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(source.project)} — ${escapeHtml(source.title)}</title>
<style>${css}</style>
</head>
<body>
<header>
  <h1>${escapeHtml(source.project)} — ${escapeHtml(source.title)}</h1>
  <p>Scope: ${source.scope.map(escapeHtml).join(', ')} | Version ${escapeHtml(source.version)} | Last updated ${escapeHtml(istNow())}</p>
</header>
<main>
  <section><div class="note">${escapeHtml(source.note)}</div></section>
  <section>
    <h2>Notation and Legend</h2>
    <p>${escapeHtml(source.notation)}</p>
    ${legendSvg}
  </section>
  <section>
    <h2>Sources</h2>
    <ul>${source.sources.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
  </section>
  <section>
    <h2>Diagrams</h2>
    <nav><ol>${source.diagrams.map((d) => `<li><a href="#${d.id}">${escapeHtml(d.id)} — ${escapeHtml(d.title)}</a></li>`).join('')}</ol></nav>
  </section>
${source.diagrams.map(diagramSection).join('\n')}
</main>
</body>
</html>
`;
}

for (const [folder, base] of targets) {
  const jsonPath = path.join(root, 'documentation', 'DFD', folder, `${base}.json`);
  if (!existsSync(jsonPath)) continue;
  const source: DfdSource = JSON.parse(readFileSync(jsonPath, 'utf8'));
  validate(source, base);
  const htmlPath = path.join(root, 'documentation', 'DFD', folder, `${base}.html`);
  writeFileSync(htmlPath, render(source), 'utf8');
  console.log(`Generated ${path.relative(root, htmlPath)} with ${source.diagrams.length} diagram(s).`);
}
