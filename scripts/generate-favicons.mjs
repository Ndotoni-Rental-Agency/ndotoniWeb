/**
 * Regenerate favicons from the green house mark in logo-light-mode.png.
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'public/images/logo-light-mode.png');

const MARK_EXTRACT_WIDTH = 300;
const MARK_SCALE = 0.84;
const BBOX_PADDING = 8;

const meta = await sharp(src).metadata();
const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

/** Transparent — green mark only; browser tab shows whatever is behind */
const background = { r: 0, g: 0, b: 0, alpha: 0 };

/** Find bounding box of the green house mark (ignore wordmark accent on the right) */
function findGreenBounds(buffer, width, height, channels, maxScanX) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < Math.min(width, maxScanX); x++) {
      const i = (y * width + x) * channels;
      const r = buffer[i];
      const g = buffer[i + 1];
      const b = buffer[i + 2];
      if (isGreenPixel(r, g, b)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return { minX, minY, maxX, maxY };
}

function isGreenPixel(r, g, b) {
  return g > 100 && g > r * 1.2 && g > b * 1.2;
}

/** Keep only the green mark; everything else is fully transparent */
async function flattenMarkTransparent(pngBuffer) {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isGreenPixel(r, g, b)) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toBuffer();
}

const maxScanX = Math.floor(meta.width * 0.34);
const bounds = findGreenBounds(data, info.width, info.height, info.channels, maxScanX);
const cropWidth = bounds.maxX - bounds.minX + 1 + BBOX_PADDING * 2;
const cropHeight = bounds.maxY - bounds.minY + 1 + BBOX_PADDING * 2;
const cropLeft = Math.max(0, bounds.minX - BBOX_PADDING);
const cropTop = Math.max(0, bounds.minY - BBOX_PADDING);

const markRegion = await sharp(src)
  .extract({
    left: cropLeft,
    top: cropTop,
    width: Math.min(cropWidth, meta.width - cropLeft),
    height: Math.min(cropHeight, meta.height - cropTop),
  })
  .png()
  .toBuffer();

const markFlattened = await flattenMarkTransparent(markRegion);

const regionMeta = await sharp(markFlattened).metadata();
const canvas = Math.max(regionMeta.width, regionMeta.height);
const padLeft = Math.floor((canvas - regionMeta.width) / 2);
const padRight = canvas - regionMeta.width - padLeft;
const padTop = Math.floor((canvas - regionMeta.height) / 2);
const padBottom = canvas - regionMeta.height - padTop;

const squareMark = await sharp(markFlattened)
  .extend({
    top: padTop,
    bottom: padBottom,
    left: padLeft,
    right: padRight,
    background,
  })
  .png()
  .toBuffer();

async function renderIcon(size) {
  const inner = Math.round(size * MARK_SCALE);
  const icon = await sharp(squareMark)
    .resize(inner, inner, { fit: 'contain', position: 'centre', background })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: icon, gravity: 'centre' }])
    .png()
    .toBuffer();
}

const outputs = [
  [16, path.join(root, 'public/favicon-16.png')],
  [32, path.join(root, 'public/favicon-32.png')],
  [48, path.join(root, 'src/app/icon.png')],
  [180, path.join(root, 'src/app/apple-icon.png')],
  [180, path.join(root, 'public/apple-touch-icon.png')],
];

for (const [size, out] of outputs) {
  const buf = await renderIcon(size);
  await sharp(buf).toFile(out);
  console.log(`Wrote ${out} (${size}px)`);
}

const favicon32 = await renderIcon(32);
await sharp(favicon32).toFile(path.join(root, 'public/favicon.ico'));
console.log('Wrote public/favicon.ico');

console.log('Crop bounds:', { cropLeft, cropTop, cropWidth, cropHeight });
