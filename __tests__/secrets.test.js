const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const mockUser = {
  firstName: 'test',
  lastName: 'test-last-name',
  email: 'test@gmail.com',
  password: '12345678',
};

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
  it.only('should create a secret if loggned in', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });
    const { email, password } = mockUser;
    await agent.post('/api/v1/users/session').send({ email, password });

    const expected = {
      title: 'secret',
      description: 'is so cute secret',
    };
    const res = await agent.post('/api/v1/secrets').send(expected);

    expect(res.body).toEqual({
      id: expect.any(String),
      ...expected,
      createdAt: expect.any(String),
    });
  });
});
