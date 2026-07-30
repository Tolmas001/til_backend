import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login to get token
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User',
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;
  });

  it('/users/profile (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('/users/profile (PUT)', () => {
    return request(app.getHttpServer())
      .put('/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Updated Name',
      })
      .expect(200);
  });

  it('/users/leaderboard (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/leaderboard')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
