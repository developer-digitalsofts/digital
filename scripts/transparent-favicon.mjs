/**
 * Makes near-white pixels in public/favicon.png transparent (keeps a one-time backup).
 * Run: node scripts/transparent-favicon.mjs
 */
import { copyFileSync, existsSync, renameSync, unlinkSync } from "fs";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const faviconPath = path.join(root, "public", "favicon.png");
const backupPath = path.join(root, "public", "favicon.original.png");

if (!existsSync(faviconPath)) {
  console.error("Missing public/favicon.png");
  process.exit(1);
}

if (!existsSync(backupPath)) {
  copyFileSync(faviconPath, backupPath);
  console.log("Backed up to public/favicon.original.png");
}

const { data, info } = await sharp(faviconPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
if (channels !== 4) {
  throw new Error(`Expected RGBA, got ${channels} channels`);
}

const buf = Buffer.from(data);
const hard = 246; // fully transparent (near white)
const soft = 200; // start softening

for (let i = 0; i < buf.length; i += 4) {
  const r = buf[i];
  const g = buf[i + 1];
  const b = buf[i + 2];
  let a = buf[i + 3];
  const maxc = Math.max(r, g, b);
  const minc = Math.min(r, g, b);
  const spread = maxc - minc;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

  // Mostly white / light gray flat regions → background
  if (lum >= hard && spread < 28) {
    buf[i + 3] = 0;
    continue;
  }
  if (lum >= soft && spread < 42) {
    const u = Math.min(1, (lum - soft) / (hard - soft));
    a = Math.floor(a * (1 - u * u));
    buf[i + 3] = Math.max(0, Math.min(255, a));
  }
}

const tmp = faviconPath + ".tmp.png";
await sharp(buf, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9, effort: 10 })
  .toFile(tmp);

unlinkSync(faviconPath);
renameSync(tmp, faviconPath);

console.log("Updated public/favicon.png with transparent near-white areas.");
