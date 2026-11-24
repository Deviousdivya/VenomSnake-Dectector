// Copies the onnxruntime-web WebAssembly runtime into public/ort so it is served from our own origin
// (used by the on-device snake model). Runs on postinstall; the files are not committed.
import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve('node_modules/onnxruntime-web/dist');
const dst = path.resolve('public/ort');
if (!fs.existsSync(src)) process.exit(0);
fs.mkdirSync(dst, { recursive: true });
for (const f of ['ort-wasm-simd-threaded.wasm', 'ort-wasm-simd-threaded.mjs']) {
  fs.copyFileSync(path.join(src, f), path.join(dst, f));
}
console.log('copied onnxruntime-web wasm runtime to public/ort');
