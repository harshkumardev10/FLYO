// scripts/gen-favicon.mjs
// Converts the Flyo kingfisher PNG to proper favicon sizes and overwrites
// both public/favicon.ico (multi-size) and public/favicon.png (512px)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'public', 'kingfisher-logo.jpg');
const DEST_PNG_512 = path.join(__dirname, '..', 'public', 'favicon.png');
const DEST_PNG_180 = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');
const DEST_PNG_32  = path.join(__dirname, '..', 'public', 'favicon-32x32.png');
const DEST_PNG_16  = path.join(__dirname, '..', 'public', 'favicon-16x16.png');

// ICO format: we'll write a minimal valid ICO with a 32x32 and 16x16 embedded PNG
const DEST_ICO = path.join(__dirname, '..', 'public', 'favicon.ico');
// Also place in app/ for Next.js metadata
const DEST_APP_ICO = path.join(__dirname, '..', 'src', 'app', 'favicon.ico');

async function main() {
  console.log('Generating Flyo favicons from kingfisher logo...');

  const base = sharp(SRC);

  // Generate individual PNGs
  await base.clone().resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(DEST_PNG_512);
  console.log('favicon.png (512x512) done');

  await base.clone().resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(DEST_PNG_180);
  console.log('apple-touch-icon.png (180x180) done');

  await base.clone().resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(DEST_PNG_32);
  console.log('favicon-32x32.png (32x32) done');

  await base.clone().resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(DEST_PNG_16);
  console.log('favicon-16x16.png (16x16) done');

  // Build a minimal ICO file containing embedded PNGs at 32x32 and 16x16
  const png32 = await base.clone().resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
  const png16 = await base.clone().resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
  const ico = buildIco([png32, png16], [32, 16]);
  fs.writeFileSync(DEST_ICO, ico);
  fs.writeFileSync(DEST_APP_ICO, ico);
  console.log('favicon.ico (32x32 + 16x16 embedded PNG) done');
  console.log('src/app/favicon.ico (Next.js app dir) done');
  console.log('All favicons generated successfully!');
}

/**
 * Build a minimal ICO file from an array of PNG buffers
 */
function buildIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + dirEntrySize * count;

  let offset = dataOffset;
  const offsets = pngBuffers.map(buf => {
    const o = offset;
    offset += buf.length;
    return o;
  });

  const totalSize = offset;
  const buf = Buffer.alloc(totalSize);

  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(count, 4);

  for (let i = 0; i < count; i++) {
    const base = 6 + i * 16;
    const size = sizes[i];
    buf.writeUInt8(size === 256 ? 0 : size, base + 0);
    buf.writeUInt8(size === 256 ? 0 : size, base + 1);
    buf.writeUInt8(0, base + 2);
    buf.writeUInt8(0, base + 3);
    buf.writeUInt16LE(1, base + 4);
    buf.writeUInt16LE(32, base + 6);
    buf.writeUInt32LE(pngBuffers[i].length, base + 8);
    buf.writeUInt32LE(offsets[i], base + 12);
  }

  for (let i = 0; i < count; i++) {
    pngBuffers[i].copy(buf, offsets[i]);
  }

  return buf;
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
