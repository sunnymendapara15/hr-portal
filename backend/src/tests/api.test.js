process.env.DATABASE_URL = ':memory:';
process.env.JWT_SECRET = 'test-secret';
process.env.ADMIN_EMAIL = 'admin@test.local';
process.env.ADMIN_PASSWORD = 'Test1234!';

const request = require('supertest');
const app = require('../app');
const { close } = require('../db');

describe('HR Portal API', () => {
  let adminToken;

  beforeAll(async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });

    expect(login.statusCode).toBe(200);
    adminToken = login.body.token;
  }, 20000);

  afterAll(async () => {
    await close();
  });

  it('allows signup for a new HR user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@hr.com',
        password: 'StrongP@ss123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toMatchObject({
      email: 'test.user@hr.com',
      role: 'hr',
    });
    expect(res.body.token).toBeDefined();
  }, 20000);

  it('restricts listing HR users to admins', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThanOrEqual(2);
  }, 20000);

  it('creates, updates, and deletes via admin endpoints', async () => {
    const newUser = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Crud',
        lastName: 'Tester',
        email: 'crud.tester@hr.com',
        password: 'CrudPass123',
      });

    expect(newUser.statusCode).toBe(201);
    const createdId = newUser.body.user.id;

    const updated = await request(app)
      .put(`/api/users/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ lastName: 'Operator' });

    expect(updated.statusCode).toBe(200);
    expect(updated.body.user.lastName).toBe('Operator');

    const deleted = await request(app)
      .delete(`/api/users/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleted.statusCode).toBe(204);
  }, 20000);
});
