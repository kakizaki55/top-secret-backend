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
  it('create a new user in the user table', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });
  it('signs in a an existing user', async () => {
    await UserService.create(mockUser);
    const { email, password } = mockUser;

    const response = await request(app)
      .post('/api/v1/users/session')
      .send({ email, password });
    expect(response.body).toEqual({ message: 'Signed in successfully!' });
  });
  it('send the correct error message', async () => {
    const { email, password } = mockUser;

    const response = await request(app)
      .post('/api/v1/users/session')
      .send({ email, password });
    expect(response.error.message).toEqual(
      'cannot POST /api/v1/users/session (401)'
    );
  });
  it('logout the currently logged in user', async () => {
    const agent = request.agent(app);
    await UserService.create(mockUser);
    const { email, password } = mockUser;

    await agent.post('/api/v1/users/session').send({ email, password });

    const signOutResponse = await agent.delete('/api/v1/users/session');

    expect(signOutResponse.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
});
