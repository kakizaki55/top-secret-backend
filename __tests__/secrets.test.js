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

  it('should create a secret if loggned in', async () => {
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
  it('gets all of the secrets but only if you are logged in', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...mockUser });
    const { email, password } = mockUser;

    await agent.post('/api/v1/users/session').send({ email, password });

    const expected = [
      {
        title: 'super big secret',
        description: 'this is one big secret',
        createdAt: expect.any(String),
      },
    ];

    const response = await agent.get('/api/v1/secrets');

    expect(response.body).toEqual(expected);
  });
});
