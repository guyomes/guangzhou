import fs from 'node:fs';
import zlib from 'node:zlib';

function createSolidPng(width, height, r, g, b, a = 255) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // color type RGBA (6)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    let c = 0xffffffff;
    for (let i = 0; i < body.length; i++) {
      c ^= body[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    crc.writeUInt32BE((c ^ 0xffffffff) >>> 0, 0);
    return Buffer.concat([len, body, crc]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte 0 at start of each scanline
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    // Radial gradient / stylized background
    const cy = y - height / 2;
    for (let x = 0; x < width; x++) {
      const cx = x - width / 2;
      const dist = Math.sqrt(cx * cx + cy * cy) / (width / 2);
      const pxOffset = rowOffset + 1 + x * 4;

      // Dark slate background with warm rose accent center
      let pr = Math.round(15 + Math.max(0, 1 - dist) * 180);
      let pg = Math.round(23 + Math.max(0, 1 - dist) * 40);
      let pb = Math.round(42 + Math.max(0, 1 - dist) * 80);

      // Simple Canton tower outline representation in center
      const inTower = Math.abs(cx) < (Math.abs(cy) < height * 0.1 ? 6 : Math.abs(cy) * 0.15) && y > height * 0.15 && y < height * 0.85;
      if (inTower) {
        pr = 244;
        pg = 63;
        pb = 94;
      }

      rawData[pxOffset] = Math.min(255, pr);
      rawData[pxOffset + 1] = Math.min(255, pg);
      rawData[pxOffset + 2] = Math.min(255, pb);
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', createSolidPng(192, 192, 15, 23, 42));
fs.writeFileSync('./public/pwa-512x512.png', createSolidPng(512, 512, 15, 23, 42));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createSolidPng(512, 512, 15, 23, 42));
fs.writeFileSync('./public/apple-touch-icon.png', createSolidPng(180, 180, 15, 23, 42));
fs.writeFileSync('./public/favicon.ico', createSolidPng(64, 64, 15, 23, 42));

console.log('PNG Icons generated successfully in public/');
