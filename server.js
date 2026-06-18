const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./database');
const { importFromExcel, isInStock } = require('./import-products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'nutritionxp-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(express.static(__dirname));

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Please log in first.' });
  }
  next();
}

function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    country: row.country
  };
}

function formatCartRow(row) {
  return {
    id: row.id,
    cartKey: row.cart_key,
    productId: row.product_id,
    source: row.source,
    name: row.name,
    price: Number(row.price) || 0,
    image: row.image,
    category: row.category,
    description: row.description,
    quantity: Number(row.quantity) || 0,
    updatedAt: row.updated_at
  };
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save(err => (err ? reject(err) : resolve()));
  });
}

async function logCartActivity(userId, action, details) {
  await db.prepare(`
    INSERT INTO cart_activity (
      user_id, action, cart_item_id, product_id, source, product_name, price, quantity, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `).run(
    userId,
    action,
    details.cartItemId || null,
    details.productId,
    details.source,
    details.productName,
    details.price,
    details.quantity
  );
}

// --- AUTH ---

app.post('/api/signup', async (req, res) => {
  const { name, email, phone, password, address, city, country } = req.body || {};
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim().toLowerCase();
  const trimmedPhone = (phone || '').trim();
  const trimmedAddress = (address || '').trim();
  const trimmedCity = (city || '').trim();
  const trimmedCountry = (country || '').trim();

  if (!trimmedName || !trimmedEmail || !trimmedPhone || !password || !trimmedAddress || !trimmedCity || !trimmedCountry) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(trimmedEmail);
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = await db.prepare(`
    INSERT INTO users (name, email, phone, password, password_hash, address, city, country, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `).run(trimmedName, trimmedEmail, trimmedPhone, password, passwordHash, trimmedAddress, trimmedCity, trimmedCountry);

  req.session.userId = result.lastInsertRowid;
  req.session.userEmail = trimmedEmail;
  await saveSession(req);

  const user = await db.prepare(
    'SELECT id, name, email, phone, address, city, country FROM users WHERE id = ?'
  ).get(result.lastInsertRowid);

  res.json({
    success: true,
    message: 'Account created successfully!',
    user: formatUser(user)
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  const trimmedEmail = (email || '').trim().toLowerCase();

  if (!trimmedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Please enter email and password.' });
  }

  const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(trimmedEmail);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  req.session.userEmail = user.email;
  await saveSession(req);

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    user: formatUser(user)
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

app.get('/api/me', async (req, res) => {
  if (!req.session.userId) {
    return res.json({ success: true, user: null });
  }

  const user = await db.prepare(
    'SELECT id, name, email, phone, address, city, country FROM users WHERE id = ?'
  ).get(req.session.userId);

  if (!user) {
    req.session.destroy(() => {});
    return res.json({ success: true, user: null });
  }

  res.json({ success: true, user: formatUser(user) });
});

// --- CART (per logged-in user) ---

app.get('/api/cart', requireLogin, async (req, res) => {
  const rows = await db.prepare(
    'SELECT * FROM cart_items WHERE user_id = ? ORDER BY updated_at DESC, id ASC'
  ).all(req.session.userId);

  res.json({ success: true, items: rows.map(formatCartRow) });
});

app.post('/api/cart', requireLogin, async (req, res) => {
  const {
    cartKey, productId, source, name, price, image, category, description, quantity
  } = req.body || {};

  if (!cartKey || !productId || !source || !name || price == null) {
    return res.status(400).json({ success: false, message: 'Invalid product data.' });
  }

  const userId = req.session.userId;
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const existing = await db.prepare(
    'SELECT * FROM cart_items WHERE user_id = ? AND cart_key = ?'
  ).get(userId, cartKey);

  if (existing) {
    const newQty = (Number(existing.quantity) || 0) + qty;
    await db.prepare(`
      UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?
    `).run(newQty, existing.id);

    await logCartActivity(userId, 'quantity_increased', {
      cartItemId: existing.id,
      productId,
      source,
      productName: name,
      price,
      quantity: qty
    });
  } else {
    const insert = await db.prepare(`
      INSERT INTO cart_items (
        user_id, cart_key, product_id, source, name, price, image, category, description, quantity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId, cartKey, productId, source, name, price,
      image || '', category || '', description || '', qty
    );

    await logCartActivity(userId, 'added', {
      cartItemId: insert.lastInsertRowid,
      productId,
      source,
      productName: name,
      price,
      quantity: qty
    });
  }

  const rows = await db.prepare(
    'SELECT * FROM cart_items WHERE user_id = ? ORDER BY updated_at DESC, id ASC'
  ).all(userId);

  res.json({ success: true, items: rows.map(formatCartRow) });
});

app.patch('/api/cart/:id', requireLogin, async (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const quantity = Math.max(1, parseInt(req.body.quantity, 10) || 1);
  const userId = req.session.userId;

  const item = await db.prepare(
    'SELECT * FROM cart_items WHERE id = ? AND user_id = ?'
  ).get(itemId, userId);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Cart item not found.' });
  }

  await db.prepare(`
    UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?
  `).run(quantity, itemId);

  await logCartActivity(userId, 'quantity_updated', {
    cartItemId: itemId,
    productId: item.product_id,
    source: item.source,
    productName: item.name,
    price: item.price,
    quantity
  });

  const rows = await db.prepare(
    'SELECT * FROM cart_items WHERE user_id = ? ORDER BY updated_at DESC, id ASC'
  ).all(userId);

  res.json({ success: true, items: rows.map(formatCartRow) });
});

app.delete('/api/cart/:id', requireLogin, async (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const userId = req.session.userId;

  const item = await db.prepare(
    'SELECT * FROM cart_items WHERE id = ? AND user_id = ?'
  ).get(itemId, userId);

  if (item) {
    await logCartActivity(userId, 'removed', {
      cartItemId: itemId,
      productId: item.product_id,
      source: item.source,
      productName: item.name,
      price: item.price,
      quantity: item.quantity
    });
  }

  await db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(itemId, userId);

  const rows = await db.prepare(
    'SELECT * FROM cart_items WHERE user_id = ? ORDER BY updated_at DESC, id ASC'
  ).all(userId);

  res.json({ success: true, items: rows.map(formatCartRow) });
});

// --- ORDERS (per logged-in user) ---

app.get('/api/orders', requireLogin, async (req, res) => {
  const orders = await db.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC'
  ).all(req.session.userId);

  const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');

  const result = await Promise.all(orders.map(async order => ({
    orderNumber: order.order_number,
    date: order.created_at,
    total: order.total,
    status: order.status,
    items: (await getItems.all(order.id)).map(item => ({
      id: item.product_id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: item.quantity
    }))
  })));

  res.json({ success: true, orders: result });
});

app.post('/api/checkout', requireLogin, async (req, res) => {
  const userId = req.session.userId;
  const items = await db.prepare('SELECT * FROM cart_items WHERE user_id = ?').all(userId);

  if (items.length === 0) {
    return res.status(400).json({ success: false, message: 'Your cart is empty.' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderNumber = 'ORD' + Date.now();

  const insertOrder = db.prepare(
    'INSERT INTO orders (user_id, order_number, total, created_at) VALUES (?, ?, ?, NOW())'
  );
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, user_id, product_id, source, name, price, image, category, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const clearCart = db.prepare('DELETE FROM cart_items WHERE user_id = ?');

  const result = await db.withTransaction(async () => {
    const order = await insertOrder.run(userId, orderNumber, total);
    const orderId = order.lastInsertRowid;

    for (const item of items) {
      await insertItem.run(
        orderId, userId, item.product_id, item.source, item.name, item.price,
        item.image, item.category, item.quantity
      );
      await logCartActivity(userId, 'checked_out', {
        cartItemId: item.id,
        productId: item.product_id,
        source: item.source,
        productName: item.name,
        price: item.price,
        quantity: item.quantity
      });
    }

    await clearCart.run(userId);
    return { orderNumber, total, orderId };
  });

  res.json({
    success: true,
    message: 'Order placed successfully!',
    order: {
      orderNumber: result.orderNumber,
      total: result.total,
      date: new Date().toLocaleString(),
      status: 'Pending',
      items: items.map(row => ({
        id: row.product_id,
        name: row.name,
        price: row.price,
        image: row.image,
        category: row.category,
        quantity: row.quantity
      }))
    }
  });
});

function formatProduct(row) {
  const inStock = isInStock(row.stock_status);
  return {
    id: row.id,
    brand: row.brand || '',
    name: row.name,
    productLink: row.product_link || '',
    image: row.image || '',
    originalPrice: Number(row.original_price || row.price) || 0,
    price: Number(row.price) || 0,
    discount: Number(row.discount) || 0,
    quantity: Number(row.quantity) || 0,
    stockStatus: row.stock_status || (inStock ? 'In Stock' : 'Out of stock'),
    inStock,
    variation: row.variation || '',
    category: row.category || '',
    description: row.description || row.variation || row.name,
    rating: 4.5,
    reviews: 0
  };
}

// --- PRODUCTS (from database – updates on site when DB changes) ---

app.get('/api/products', async (req, res) => {
  const { category, brand, search, inStock } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    sql += ' AND LOWER(TRIM(category)) = LOWER(TRIM(?))';
    params.push(category);
  }
  if (brand) {
    sql += ' AND LOWER(TRIM(brand)) = LOWER(TRIM(?))';
    params.push(brand);
  }
  if (search) {
    sql += ' AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ?)';
    const term = `%${String(search).toLowerCase()}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY name ASC';
  const rows = await db.prepare(sql).all(...params);
  let products = rows.map(formatProduct);

  if (inStock === 'true') {
    products = products.filter(p => p.inStock);
  }

  res.json({ success: true, products });
});

app.get('/api/products/:id', async (req, res) => {
  const row = await db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(req.params.id, 10));
  if (!row) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json({ success: true, product: formatProduct(row) });
});

app.get('/api/categories', async (req, res) => {
  const rows = await db.prepare(`
    SELECT c.id, c.name, c.description, c.image,
      (SELECT COUNT(*) FROM products p WHERE LOWER(TRIM(p.category)) = LOWER(TRIM(c.name))) AS product_count
    FROM categories c
    ORDER BY c.name ASC
  `).all();

  const fromProducts = await db.prepare(`
    SELECT DISTINCT TRIM(category) AS name, COUNT(*) AS product_count
    FROM products
    WHERE TRIM(category) != ''
    GROUP BY LOWER(TRIM(category))
    ORDER BY name ASC
  `).all();

  const merged = new Map();
  for (const row of rows) {
    merged.set(row.name.toLowerCase(), {
      id: row.id,
      name: row.name,
      description: row.description || '',
      image: row.image || '',
      productCount: row.product_count
    });
  }
  for (const row of fromProducts) {
    const key = row.name.toLowerCase();
    if (!merged.has(key)) {
      merged.set(key, {
        id: null,
        name: row.name,
        description: '',
        image: '',
        productCount: row.product_count
      });
    }
  }

  res.json({ success: true, categories: [...merged.values()] });
});

app.get('/api/brands', async (req, res) => {
  const rows = await db.prepare(`
    SELECT b.id, b.name, b.image,
      (SELECT COUNT(*) FROM products p WHERE LOWER(TRIM(p.brand)) = LOWER(TRIM(b.name))) AS product_count
    FROM brands b
    ORDER BY b.name ASC
  `).all();

  const fromProducts = await db.prepare(`
    SELECT DISTINCT TRIM(brand) AS name, COUNT(*) AS product_count
    FROM products
    WHERE TRIM(brand) != ''
    GROUP BY LOWER(TRIM(brand))
    ORDER BY name ASC
  `).all();

  const merged = new Map();
  for (const row of rows) {
    merged.set(row.name.toLowerCase(), {
      id: row.id,
      name: row.name,
      image: row.image || '',
      productCount: row.product_count
    });
  }
  for (const row of fromProducts) {
    const key = row.name.toLowerCase();
    if (!merged.has(key)) {
      merged.set(key, {
        id: null,
        name: row.name,
        image: '',
        productCount: row.product_count
      });
    }
  }

  res.json({ success: true, brands: [...merged.values()] });
});

app.post('/api/admin/import-products', async (req, res) => {
  try {
    const result = await importFromExcel(true);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin-style summary: view all users with cart + order counts (for your records)
app.get('/api/admin/users-summary', async (req, res) => {
  const users = await db.prepare(`
    SELECT u.id, u.name, u.email, u.phone, u.password, u.address, u.city, u.country, u.created_at,
      (SELECT COUNT(*) FROM cart_items c WHERE c.user_id = u.id) AS cart_item_count,
      (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
    FROM users u
    ORDER BY u.id ASC
  `).all();

  res.json({ success: true, users });
});

app.get('/api/admin/user/:id/cart', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = await db.prepare(
    'SELECT id, name, email, phone, address, city, country FROM users WHERE id = ?'
  ).get(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const currentCart = await db.prepare(
    'SELECT * FROM cart_items WHERE user_id = ? ORDER BY updated_at DESC'
  ).all(userId);

  const activity = await db.prepare(
    'SELECT * FROM cart_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 100'
  ).all(userId);

  const orders = await db.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
  ).all(userId);

  res.json({
    success: true,
    user: formatUser(user),
    currentCart: currentCart.map(formatCartRow),
    cartActivity: activity,
    orders
  });
});

async function start() {
  await db.init();

  try {
    const importResult = await importFromExcel(false);
    if (importResult.imported) {
      console.log(`Imported ${importResult.products} products from Excel into database.`);
    }
  } catch (err) {
    console.warn('Product import skipped:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`NutritionXP running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/index.html in your browser`);
  });
}


start().catch(err => {
  console.error('Failed to start NutritionXP:');
  console.error(err);
  console.error(err.stack);
  process.exit(1);
});
