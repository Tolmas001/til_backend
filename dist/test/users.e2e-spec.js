"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("./../src/app.module");
describe('UsersController (e2e)', () => {
    let app;
    let authToken;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
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
//# sourceMappingURL=users.e2e-spec.js.map