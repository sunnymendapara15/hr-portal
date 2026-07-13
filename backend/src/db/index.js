const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { databaseUrl, adminEmail, adminPassword } = require('../config');

const directory = path.dirname(databaseUrl);
fs.mkdirSync(directory, { recursive: true });

const db = new sqlite3.Database(databaseUrl, (err) => {
  if (err) {
    console.error('Unable to open SQLite database:', err);
    process.exit(1);
  }
});

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });

const close = () =>
  new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

const initialize = () =>
  new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'hr',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            return reject(err);
          }

          db.get('SELECT COUNT(*) as count FROM users WHERE email = ?', [adminEmail], (err, row) => {
            if (err) {
              return reject(err);
            }

            if (row && row.count > 0) {
              return resolve();
            }

            const now = new Date().toISOString();
            const passwordHash = bcrypt.hashSync(adminPassword, 10);

            db.run(
              'INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
              ['System', 'Admin', adminEmail, passwordHash, 'admin', now, now],
              (insertErr) => {
                if (insertErr) {
                  return reject(insertErr);
                }
                resolve();
              }
            );
          });
        }
      );
    });
  });

initialize().catch((error) => {
  console.error('Failed to initialize the database:', error);
  process.exit(1);
});

module.exports = {
  run,
  get,
  all,
  close,
};
