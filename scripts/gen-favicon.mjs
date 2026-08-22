// scripts/gen-favicon.mjs
// Converts the Flyo kingfisher PNG to proper favicon sizes and overwrites
// both public/ and src/app/ favicons (including Google Search 48x48 requirement)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'public', 'kingfisher-logo.jpg');

// Target locations
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const APP_DIR = path.join(__dirname, '..', 'src', 'app');

const SIZES = [
  { name: 'favicon.png', size: 512 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-144x144.png', size: 144 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'favicon-48x48.png', size: 48 }, // Critical for Google Search
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
];

async function main() {
  console.log('Generating FLYO favicons from kingfisher logo...');
  const base = sharp(SRC);

  // Generate PNG files in public and app directories
  for (const item of SIZES) {
    const pubPath = path.join(PUBLIC_DIR, item.name);
    await base.clone().resize(item.size, item.size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(pubPath);
    console.log(`${item.name} (${item.size}x${item.size}) generated in public/`);
  }

  // Also copy icon.png & apple-icon.png to app/
  await base.clone().resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(path.join(APP_DIR, 'icon.png'));
  await base.clone().resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(path.join(APP_DIR, 'apple-icon.png'));

  // Build multi-resolution ICO file containing embedded PNGs at 48x48, 32x32, 16x16
  const png48 = await base.clone().resize(48, 48, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
  const png32 = await base.clone().resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
  const png16 = await base.clone().resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
  
  const ico = buildIco([png48, png32, png16], [48, 32, 16]);
  
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), ico);
  fs.writeFileSync(path.join(APP_DIR, 'favicon.ico'), ico);
  console.log('favicon.ico (48x48 + 32x32 + 16x16) generated in public/ and src/app/');

  // Copy icon.svg to src/app/ as icon.svg
  const pubSvg = path.join(PUBLIC_DIR, 'icon.svg');
  if (fs.existsSync(pubSvg)) {
    fs.copyFileSync(pubSvg, path.join(APP_DIR, 'icon.svg'));
    console.log('icon.svg copied to src/app/icon.svg');
  }

  console.log('All FLYO favicons generated successfully!');
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

