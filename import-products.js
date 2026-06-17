const path = require('path');
const XLSX = require('xlsx');
const db = require('./database');

const EXCEL_FILE = path.join(__dirname, 'NutritionXP Website Product.xlsx');

function normalizeText(value) {
  return String(value || '').trim();
}

function parseNumber(value) {
  const num = parseFloat(String(value || '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(num) ? num : 0;
}

function isInStock(stockStatus) {
  const status = normalizeText(stockStatus).toLowerCase();
  return status.includes('in stock') && !status.includes('out');
}

async function importFromExcel(force = false) {
  const existing = await db.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (!force && existing.count > 0) {
    return { imported: false, message: 'Products already in database. Use force=true to re-import.' };
  }

  const workbook = XLSX.readFile(EXCEL_FILE);
  const brandRows = XLSX.utils.sheet_to_json(workbook.Sheets['Brand data'], { defval: '' });
  const categoryRows = XLSX.utils.sheet_to_json(workbook.Sheets['Category'], { defval: '', header: 1 });
  const brandSheetRows = XLSX.utils.sheet_to_json(workbook.Sheets['Brands'], { defval: '', header: 1 });

  const clearAll = db.prepare('DELETE FROM products');
  const clearCategories = db.prepare('DELETE FROM categories');
  const clearBrands = db.prepare('DELETE FROM brands');

  const insertProduct = db.prepare(`
    INSERT INTO products (
      brand, name, product_link, image, original_price, price, discount,
      quantity, stock_status, variation, category, description, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `);

  const insertCategory = db.prepare(`
    INSERT IGNORE INTO categories (name) VALUES (?)
  `);

  const insertBrand = db.prepare(`
    INSERT IGNORE INTO brands (name) VALUES (?)
  `);

  let productCount = 0;

  await db.withTransaction(async () => {
    if (force) {
      await clearAll.run();
      await clearCategories.run();
      await clearBrands.run();
    }

    for (const row of brandRows) {
      const name = normalizeText(row['Name of product']);
      if (!name) continue;

      const brand = normalizeText(row.Brand);
      const category = normalizeText(row.Category);
      const variation = normalizeText(row['Variation in KG/GMS\n'] || row['Variation in KG/GMS']);
      const stockStatus = normalizeText(row['in stock/ out of stock']) || 'In Stock';
      const description = variation
        ? `${brand}${brand ? ' – ' : ''}${variation}`
        : brand;

      await insertProduct.run(
        brand,
        name,
        normalizeText(row.Product),
        normalizeText(row['link of image']),
        parseNumber(row['original price']),
        parseNumber(row['our price']) || parseNumber(row['original price']),
        parseNumber(row['discount in %']),
        parseInt(row['Quantity '], 10) || 0,
        stockStatus,
        variation,
        category,
        description
      );
      productCount += 1;

      if (category) await insertCategory.run(category);
      if (brand) await insertBrand.run(brand);
    }

    for (const row of categoryRows) {
      const name = normalizeText(row[0]);
      if (name && name.toLowerCase() !== 'menu') {
        await insertCategory.run(name);
      }
    }

    for (const row of brandSheetRows) {
      const brandName = normalizeText(row[0]);
      if (brandName && brandName.toUpperCase() !== 'BRANDS') {
        await insertBrand.run(brandName);
      }
    }
  });

  return {
    imported: true,
    products: productCount,
    categories: (await db.prepare('SELECT COUNT(*) AS count FROM categories').get()).count,
    brands: (await db.prepare('SELECT COUNT(*) AS count FROM brands').get()).count
  };
}

if (require.main === module) {
  const force = process.argv.includes('--force');

  (async () => {
    try {
      await db.init();
      const result = await importFromExcel(force);
      console.log(result);
    } catch (err) {
      console.error('Import failed:', err.message);
      process.exit(1);
    } finally {
      await db.pool.end();
    }
  })();
}

module.exports = { importFromExcel, isInStock };
