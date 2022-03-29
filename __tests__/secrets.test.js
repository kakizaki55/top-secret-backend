const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('top-secret-backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  const mockSecret = {
    title: 'a new secret',
    description: 'a new description ',
  };

  it('add a new secret to the data base', async () => {
    const response = await request(app)
      .post('/api/v1/secrets')
      .send(mockSecret);

    expect(response.body).toEqual({
      ...mockSecret,
      id: expect.any(String),
      created_at: expect.any(String),
    });
  });
});
