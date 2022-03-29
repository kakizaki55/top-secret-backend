const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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
  it('protect route using middle wear to authenticate before being able to insert', async () => {
    const agent = request.agent(app);

    const mockUser = {
      firstName: 'test',
      lastName: 'test-last-name',
      email: 'test@gmail.com',
      password: '12345678',
    };

    await UserService.create(mockUser);
    const { email, password } = mockUser;

    const logoutResponse = await agent.get('/api/v1/secrets');
    expect(logoutResponse.status).toEqual(401);

    const response = await request(app)
      .post('/api/v1/users/session')
      .send({ email, password });
    expect(response.body).toEqual({ message: 'Signed in successfully!' });

    const secretResponse = await request(app)
      .post('/api/v1/secrets')
      .send(mockSecret);

    expect(secretResponse.body).toEqual({
      ...mockSecret,
      id: expect.any(String),
      created_at: expect.any(String),
    });

    const loginResponse = await agent.get('/api/v1/secrets');
    expect(loginResponse.status).toEqual(200);
  });
});
