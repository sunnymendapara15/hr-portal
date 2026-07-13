const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { run, get, all } = require('../db');

const createSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid('admin', 'hr').default('hr'),
});

const updateSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  email: Joi.string().trim().lowercase().email(),
  password: Joi.string().min(8).max(128),
  role: Joi.string().valid('admin', 'hr'),
}).min(1);

const sanitizeUser = (row) => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  role: row.role,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const listUsers = async (req, res, next) => {
  try {
    const rows = await all('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ users: rows.map(sanitizeUser) });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details.map((detail) => detail.message),
      });
    }

    const existing = await get('SELECT id FROM users WHERE email = ?', [value.email]);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    const now = new Date().toISOString();

    const { lastID } = await run(
      'INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [value.firstName, value.lastName, value.email, hashedPassword, value.role, now, now]
    );

    const userRow = await get('SELECT * FROM users WHERE id = ?', [lastID]);
    res.status(201).json({ user: sanitizeUser(userRow) });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details.map((detail) => detail.message),
      });
    }

    const { id } = req.params;
    const user = await get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (value.email) {
      const duplicate = await get('SELECT id FROM users WHERE email = ? AND id != ?', [value.email, id]);
      if (duplicate) {
        return res.status(409).json({ message: 'Email already registered' });
      }
    }

    const updates = [];
    const params = [];

    if (value.firstName) {
      updates.push('first_name = ?');
      params.push(value.firstName);
    }

    if (value.lastName) {
      updates.push('last_name = ?');
      params.push(value.lastName);
    }

    if (value.email) {
      updates.push('email = ?');
      params.push(value.email);
    }

    if (value.role) {
      updates.push('role = ?');
      params.push(value.role);
    }

    if (value.password) {
      const hashed = await bcrypt.hash(value.password, 10);
      updates.push('password = ?');
      params.push(hashed);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No editable fields provided' });
    }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());

    params.push(id);

    await run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    const updated = await get('SELECT * FROM users WHERE id = ?', [id]);
    res.json({ user: sanitizeUser(updated) });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await run('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};
