const mysql = require('mysql2/promise');
const { AsyncLocalStorage } = require('node:async_hooks');

const config = {
  host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
  user: process.env.DB_USER || 'sql12830745',
  password: process.env.DB_PASSWORD || 'iNJwhh5Vgv',
  database: process.env.DB_NAME || 'sql12830745',
  waitForConnections: true,
  connectionLimit: 10
};

const pool = mysql.createPool(config);
const transactionConnection = new AsyncLocalStorage();

function runner() {
  return transactionConnection.getStore() || pool;
}

function normalizeSql(sql) {
  return sql
    .replace(/datetime\('now'\)/gi, 'NOW()')
    .replace(/INSERT\s+OR\s+IGNORE/gi, 'INSERT IGNORE');
}

function prepare(sql) {
  const normalizedSql = normalizeSql(sql);

  return {
    async all(...params) {
      const [rows] = await runner().execute(normalizedSql, params);
      return rows;
    },
    async get(...params) {
      const [rows] = await runner().execute(normalizedSql, params);
      return rows[0] || null;
    },
    async run(...params) {
      const [result] = await runner().execute(normalizedSql, params);
      return {
        insertId: result.insertId,
        lastInsertRowid: result.insertId,
        changes: result.affectedRows
      };
    }
  };
}

async function exec(sql) {
  const statements = normalizeSql(sql)
    .split(';')
    .map(statement => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await runner().query(statement);
  }
}

async function columnExists(table, column) {
  const row = await prepare(`
    SELECT COUNT(*) AS count
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
  `).get(table, column);

  return Number(row.count) > 0;
}

async function getColumnInfo(table, column) {
  return prepare(`
    SELECT COLUMN_TYPE AS columnType, IS_NULLABLE AS isNullable, COLUMN_KEY AS columnKey, EXTRA AS extra
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
  `).get(table, column);
}

async function ensureAutoIncrementId(table) {
  const info = await getColumnInfo(table, 'id');
  if (!info || String(info.extra || '').toLowerCase().includes('auto_increment')) {
    return;
  }

  try {
    await exec(`ALTER TABLE ${table} MODIFY id INT NOT NULL`);

    if (info.columnKey !== 'PRI') {
      await exec(`ALTER TABLE ${table} ADD PRIMARY KEY (id)`);
    }

    await exec(`ALTER TABLE ${table} MODIFY id INT NOT NULL AUTO_INCREMENT`);
  } catch (err) {
    if (info.columnKey === 'PRI') {
      throw err;
    }

    await exec(`ALTER TABLE ${table} ADD COLUMN __new_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST`);
    await exec(`ALTER TABLE ${table} DROP COLUMN id`);
    await exec(`ALTER TABLE ${table} CHANGE __new_id id INT NOT NULL AUTO_INCREMENT`);
  }
}

async function widenExistingColumns() {
  await exec(`
    ALTER TABLE users
      MODIFY name VARCHAR(255) NOT NULL,
      MODIFY email VARCHAR(255) NOT NULL,
      MODIFY phone VARCHAR(50) NOT NULL,
      MODIFY password VARCHAR(255) NOT NULL DEFAULT '',
      MODIFY password_hash VARCHAR(255) NOT NULL,
      MODIFY address TEXT NOT NULL,
      MODIFY city VARCHAR(255) NOT NULL,
      MODIFY country VARCHAR(255) NOT NULL,
      MODIFY created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE products
      MODIFY brand VARCHAR(255),
      MODIFY name VARCHAR(255) NOT NULL,
      MODIFY product_link TEXT,
      MODIFY image TEXT,
      MODIFY stock_status VARCHAR(100) DEFAULT 'In Stock',
      MODIFY variation VARCHAR(255),
      MODIFY category VARCHAR(255),
      MODIFY description TEXT;

    ALTER TABLE categories
      MODIFY name VARCHAR(255) NOT NULL,
      MODIFY description TEXT,
      MODIFY image TEXT;

    ALTER TABLE brands
      MODIFY name VARCHAR(255) NOT NULL,
      MODIFY image TEXT;

    ALTER TABLE cart_items
      MODIFY cart_key VARCHAR(255) NOT NULL,
      MODIFY source VARCHAR(100) NOT NULL,
      MODIFY name VARCHAR(255) NOT NULL,
      MODIFY image TEXT,
      MODIFY category VARCHAR(255),
      MODIFY description TEXT;

    ALTER TABLE cart_activity
      MODIFY action VARCHAR(100) NOT NULL,
      MODIFY source VARCHAR(100) NOT NULL,
      MODIFY product_name VARCHAR(255) NOT NULL,
      MODIFY created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE orders
      MODIFY order_number VARCHAR(100) NOT NULL,
      MODIFY status VARCHAR(100) NOT NULL DEFAULT 'Pending',
      MODIFY created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE order_items
      MODIFY source VARCHAR(100) NOT NULL,
      MODIFY name VARCHAR(255) NOT NULL,
      MODIFY image TEXT,
      MODIFY category VARCHAR(255),
      MODIFY created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
}

async function init() {
  await exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL DEFAULT '',
      password_hash VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      brand VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      product_link TEXT,
      image TEXT,
      original_price DECIMAL(10,2),
      price DECIMAL(10,2) NOT NULL,
      discount DECIMAL(10,2) DEFAULT 0,
      quantity INT DEFAULT 0,
      stock_status VARCHAR(100) DEFAULT 'In Stock',
      variation VARCHAR(255),
      category VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS brands (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      cart_key VARCHAR(255) NOT NULL,
      product_id INT NOT NULL,
      source VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image TEXT,
      category VARCHAR(255),
      description TEXT,
      quantity INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL ,
      UNIQUE KEY unique_user_cart_key (user_id, cart_key),
      CONSTRAINT fk_cart_items_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_activity (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      action VARCHAR(100) NOT NULL,
      cart_item_id INT,
      product_id INT NOT NULL,
      source VARCHAR(100) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      quantity INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_cart_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      order_number VARCHAR(100) NOT NULL UNIQUE,
      total DECIMAL(10,2) NOT NULL,
      status VARCHAR(100) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      source VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image TEXT,
      category VARCHAR(255),
      quantity INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      CONSTRAINT fk_order_items_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  if (!(await columnExists('users', 'phone'))) {
    await exec(`ALTER TABLE users ADD COLUMN phone VARCHAR(50) NOT NULL DEFAULT ''`);
  }
  if (!(await columnExists('users', 'address'))) {
    await exec(`ALTER TABLE users ADD COLUMN address TEXT NOT NULL`);
  }
  if (!(await columnExists('users', 'city'))) {
    await exec(`ALTER TABLE users ADD COLUMN city VARCHAR(255) NOT NULL DEFAULT ''`);
  }
  if (!(await columnExists('users', 'country'))) {
    await exec(`ALTER TABLE users ADD COLUMN country VARCHAR(255) NOT NULL DEFAULT ''`);
  }
  if (!(await columnExists('users', 'password'))) {
    await exec(`ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT ''`);
  }
  if (!(await columnExists('cart_items', 'updated_at'))) {
    await exec(`ALTER TABLE cart_items ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    await exec(`UPDATE cart_items SET updated_at = created_at`);
  }
  if (!(await columnExists('cart_activity', 'created_at'))) {
    await exec(`ALTER TABLE cart_activity ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
  }
  if (!(await columnExists('orders', 'created_at'))) {
    await exec(`ALTER TABLE orders ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
  }
  if (!(await columnExists('order_items', 'user_id'))) {
    await exec(`ALTER TABLE order_items ADD COLUMN user_id INT`);
    await exec(`
      UPDATE order_items oi
      JOIN orders o ON o.id = oi.order_id
      SET oi.user_id = o.user_id
    `);
    await exec(`ALTER TABLE order_items MODIFY user_id INT NOT NULL`);
  }
  if (!(await columnExists('order_items', 'created_at'))) {
    await exec(`ALTER TABLE order_items ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
  }

  await ensureAutoIncrementId('users');
  await ensureAutoIncrementId('products');
  await ensureAutoIncrementId('categories');
  await ensureAutoIncrementId('brands');
  await ensureAutoIncrementId('cart_items');
  await ensureAutoIncrementId('cart_activity');
  await ensureAutoIncrementId('orders');
  await ensureAutoIncrementId('order_items');
  await widenExistingColumns();
}

async function withTransaction(fn) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await transactionConnection.run(connection, fn);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  init,
  exec,
  prepare,
  withTransaction,
  pool,
  config
};
