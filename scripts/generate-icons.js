import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  const bytesPerPixel = 4;
  const rawData = Buffer.alloc(height * (1 + width * bytesPerPixel));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Draw a joyful icon with gradient background, golden sun with smile, and warm stars
function drawJoyIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const r = w / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background gradient: Indigo (#4F46E5) to Violet (#7C3AED) to Pink (#EC4899)
  const normY = y / h;
  let bgR = Math.round(79 + (236 - 79) * normY);
  let bgG = Math.round(70 + (72 - 70) * normY);
  let bgB = Math.round(229 + (153 - 229) * normY);

  if (!isMaskable) {
    // Round corner clip (squircle)
    const cornerR = w * 0.25;
    const clX = Math.max(0, Math.abs(dx) - (w / 2 - cornerR));
    const clY = Math.max(0, Math.abs(dy) - (h / 2 - cornerR));
    if (clX * clX + clY * clY > cornerR * cornerR) {
      return [0, 0, 0, 0];
    }
  }

  // Sun in center
  const sunRadius = w * (isMaskable ? 0.28 : 0.32);
  const sunDist = Math.sqrt(dx * dx + (dy + w * 0.02) * (dy + w * 0.02));

  if (sunDist < sunRadius) {
    // Sun body: golden yellow (#FBBF24 to #F59E0B)
    const sunGrad = (y - (cy - sunRadius)) / (sunRadius * 2);
    let sR = 251, sG = Math.round(191 - 33 * sunGrad), sB = 36;

    // Eyes
    const eyeY = cy - w * 0.05;
    const eyeL_X = cx - w * 0.1;
    const eyeR_X = cx + w * 0.1;
    const dEyeL = Math.hypot(x - eyeL_X, y - eyeY);
    const dEyeR = Math.hypot(x - eyeR_X, y - eyeY);

    if (dEyeL < w * 0.035 || dEyeR < w * 0.035) {
      // Black eyes with little white highlight
      if (Math.hypot(x - (eyeL_X + w * 0.01), y - (eyeY - w * 0.01)) < w * 0.012 ||
          Math.hypot(x - (eyeR_X + w * 0.01), y - (eyeY - w * 0.01)) < w * 0.012) {
        return [255, 255, 255, 255];
      }
      return [30, 27, 75, 255];
    }

    // Rosy cheeks
    const cheekY = cy + w * 0.02;
    const dCheekL = Math.hypot(x - (cx - w * 0.16), y - cheekY);
    const dCheekR = Math.hypot(x - (cx + w * 0.16), y - cheekY);
    if (dCheekL < w * 0.04 || dCheekR < w * 0.04) {
      return [251, 113, 133, 220];
    }

    // Smiling mouth
    const mouthDist = Math.hypot(dx, dy - w * 0.03);
    if (mouthDist > w * 0.075 && mouthDist < w * 0.098 && dy > w * 0.03 && dy < w * 0.12 && Math.abs(dx) < w * 0.09) {
      return [30, 27, 75, 255];
    }

    return [sR, sG, sB, 255];
  }

  // Sun rays
  const angle = Math.atan2(dy, dx);
  const rayIndex = Math.round((angle / (Math.PI * 2)) * 12);
  const angleDiff = Math.abs(angle - (rayIndex * (Math.PI * 2) / 12));
  if (sunDist > sunRadius + w * 0.03 && sunDist < sunRadius + w * 0.12 && angleDiff < 0.08) {
    return [253, 224, 71, 230];
  }

  // Sparkle stars in top corners
  const dStar1 = Math.hypot(x - cx * 0.45, y - cy * 0.45);
  if (dStar1 < w * 0.04) return [255, 255, 255, 255];

  const dStar2 = Math.hypot(x - cx * 1.55, y - cy * 0.45);
  if (dStar2 < w * 0.035) return [255, 255, 255, 255];

  return [bgR, bgG, bgB, 255];
}

fs.mkdirSync('/public', { recursive: true });

fs.writeFileSync('/public/pwa-192x192.png', createPNG(192, 192, (x, y, w, h) => drawJoyIcon(x, y, w, h, false)));
fs.writeFileSync('/public/pwa-512x512.png', createPNG(512, 512, (x, y, w, h) => drawJoyIcon(x, y, w, h, false)));
fs.writeFileSync('/public/pwa-maskable-512x512.png', createPNG(512, 512, (x, y, w, h) => drawJoyIcon(x, y, w, h, true)));
fs.writeFileSync('/public/apple-touch-icon.png', createPNG(180, 180, (x, y, w, h) => drawJoyIcon(x, y, w, h, false)));
fs.writeFileSync('/public/favicon.ico', createPNG(32, 32, (x, y, w, h) => drawJoyIcon(x, y, w, h, false)));

console.log('All icons generated successfully!');
