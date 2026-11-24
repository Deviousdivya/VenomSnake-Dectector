// On-device snake classifier: SnakeCLEF-2024 baseline (SwinV2-tiny, int8-quantised ONNX) + a small head trained on
// Indian species photos. Runs in the browser with WebAssembly - no API key, no quota, photo never leaves the device.
// See docs/identification-model-evaluation.md for how it was built and measured.

const MODEL_URL = '/models/snake-swin-int8.onnx?v=1';
const HEAD_URL = '/models/head.json?v=1';
const SIZE = 256;

interface Head {
  species: string[];
  danger: string[];
  mean: number[];
  sd: number[];
  W: number[][];
  b: number[];
}

export interface LocalCandidate {
  key: string;
  prob: number;
}

export interface LocalPrediction {
  top: LocalCandidate[]; // best 3
  confidence: number; // probability of the top species, 0-1
  pDanger: number; // probability the snake is one of the dangerous species, 0-1
  maxLogit: number; // how strongly the base model recognised *any* snake (low = unfamiliar / unclear photo)
}

let enginePromise: Promise<{ ort: any; session: any; head: Head }> | null = null;

async function fetchWithProgress(url: string, onProgress?: (f: number) => void): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Could not load ${url} (${res.status})`);
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    if (total && onProgress) onProgress(Math.min(1, got / total));
  }
  const out = new Uint8Array(got);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

export function loadEngine(onProgress?: (fraction: number) => void) {
  if (!enginePromise) {
    enginePromise = (async () => {
      const ort: any = await import('onnxruntime-web/wasm');
      ort.env.wasm.wasmPaths = '/ort/';
      ort.env.wasm.numThreads = 1; // multi-threading would need cross-origin isolation headers
      const [bytes, head] = await Promise.all([
        fetchWithProgress(MODEL_URL, onProgress),
        fetch(HEAD_URL).then((r) => {
          if (!r.ok) throw new Error('head missing');
          return r.json() as Promise<Head>;
        }),
      ]);
      const session = await ort.InferenceSession.create(bytes, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
      return { ort, session, head };
    })().catch((e) => {
      enginePromise = null; // allow a retry on the next scan
      throw e;
    });
  }
  return enginePromise;
}

async function toPixels(blob: Blob): Promise<Uint8Array> {
  const bmp = await createImageBitmap(blob, { imageOrientation: 'from-image' });
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas not available');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, SIZE, SIZE); // stretched to 256x256, same as in training
  bmp.close();
  const rgba = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const rgb = new Uint8Array(SIZE * SIZE * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4) {
    rgb[j++] = rgba[i];
    rgb[j++] = rgba[i + 1];
    rgb[j++] = rgba[i + 2];
  }
  return rgb;
}

export function headPredict(logits: ArrayLike<number>, head: Head): LocalPrediction {
  const D = head.mean.length;
  const K = head.species.length;
  const x = new Float64Array(D);
  let maxLogit = -Infinity;
  for (let j = 0; j < D; j++) {
    x[j] = (logits[j] - head.mean[j]) / head.sd[j];
    if (logits[j] > maxLogit) maxLogit = logits[j];
  }
  const z = new Float64Array(K);
  let zm = -Infinity;
  for (let k = 0; k < K; k++) {
    let s = head.b[k];
    const w = head.W[k];
    for (let j = 0; j < D; j++) s += w[j] * x[j];
    z[k] = s;
    if (s > zm) zm = s;
  }
  let sum = 0;
  const p = new Float64Array(K);
  for (let k = 0; k < K; k++) {
    p[k] = Math.exp(z[k] - zm);
    sum += p[k];
  }
  const dangerSet = new Set(head.danger);
  let pDanger = 0;
  const all: LocalCandidate[] = [];
  for (let k = 0; k < K; k++) {
    p[k] /= sum;
    if (dangerSet.has(head.species[k])) pDanger += p[k];
    all.push({ key: head.species[k], prob: p[k] });
  }
  all.sort((a, b) => b.prob - a.prob);
  return { top: all.slice(0, 3), confidence: all[0].prob, pDanger, maxLogit };
}

export async function classifyLocally(blob: Blob, onProgress?: (fraction: number) => void): Promise<LocalPrediction> {
  const { ort, session, head } = await loadEngine(onProgress);
  const pixels = await toPixels(blob);
  const out = await session.run({ input: new ort.Tensor('uint8', pixels, [SIZE, SIZE, 3]) });
  return headPredict(out.output.data as Float32Array, head);
}
