/**
 * download-images.js
 * Run: node download-images.js
 *
 * Downloads every product image URL into the local /Images folder,
 * names the file after the product, then updates the database so the
 * image column points to /Images/ProductName.jpg instead of an external URL.
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const URL   = require('url').URL;
const db    = require('./database');

const IMAGES_DIR = path.join(__dirname, 'Images');

// ── helpers ────────────────────────────────────────────────────────────────

/** Strip characters that are illegal in Windows filenames */
function safeName(name) {
  return String(name || '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 120);
}

/** Guess extension from a URL */
function extFromUrl(imageUrl) {
  try {
    const p = new URL(imageUrl).pathname.toLowerCase();
    if (p.endsWith('.png'))  return '.png';
    if (p.endsWith('.webp')) return '.webp';
    if (p.endsWith('.gif'))  return '.gif';
  } catch {}
  return '.jpg';
}

/** Download a URL to destPath, following up to 5 redirects */
function download(imageUrl, destPath, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) { reject(new Error('Too many redirects')); return; }

    let parsedUrl;
    try { parsedUrl = new URL(imageUrl); } catch { reject(new Error('Invalid URL')); return; }

    const proto = parsedUrl.protocol === 'https:' ? https : http;
    const req = proto.get(imageUrl, { timeout: 15000 }, res => {
      // Follow redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : parsedUrl.origin + res.headers.location;
        download(next, destPath, redirects + 1).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error',  err => { fs.unlink(destPath, () => {}); reject(err); });
    });

    req.on('error',   err => { fs.unlink(destPath, () => {}); reject(err); });
    req.on('timeout', ()  => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ── main ───────────────────────────────────────────────────────────────────

(async () => {
  try {
    await db.init();

    // Make sure the Images directory exists
    if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

    const products = await db.prepare('SELECT id, name, image FROM products').all();
    console.log(`Found ${products.length} products in database.\n`);

    let updated = 0, skipped = 0, failed = 0;

    for (const p of products) {
      const label = `[${p.id}] ${p.name}`;

      // No image URL at all
      if (!p.image) {
        console.log(`  SKIP  ${label}  — no image URL`);
        skipped++;
        continue;
      }

      // Already saved locally
      if (p.image.startsWith('/Images/') || p.image.startsWith('Images/')) {
        console.log(`  SKIP  ${label}  — already local`);
        skipped++;
        continue;
      }

      const name     = safeName(p.name);
      const ext      = extFromUrl(p.image);
      const filename = name + ext;
      const destPath = path.join(IMAGES_DIR, filename);
      const localUrl = '/Images/' + filename;

      // File already downloaded in a previous run
      if (fs.existsSync(destPath)) {
        await db.prepare('UPDATE products SET image = ? WHERE id = ?').run(localUrl, p.id);
        console.log(`  EXIST ${label}  → ${localUrl}`);
        updated++;
        continue;
      }

      process.stdout.write(`  DOWN  ${label}  … `);
      try {
        await download(p.image, destPath);
        await db.prepare('UPDATE products SET image = ? WHERE id = ?').run(localUrl, p.id);
        console.log(`→ ${localUrl}`);
        updated++;
      } catch (err) {
        console.log(`FAILED (${err.message})`);
        failed++;
      }
    }

    console.log(`\n─── Done ───────────────────────────────`);
    console.log(`  Updated : ${updated}`);
    console.log(`  Skipped : ${skipped}`);
    console.log(`  Failed  : ${failed}`);
    console.log(`────────────────────────────────────────`);

  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
})();
