import request from 'supertest';
import { application, Shutdown } from '../../src/server';

afterAll((done) => {
    Shutdown(done);
});

describe('Our Application', () => {
    it('Starts and has proper test environment', async () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(application).toBeDefined();
    }, 10000);

    it('Returns all options allowed to be called by customer(http methods)', async () => {
        const response = await request(application)
            .options('/') // Gửi yêu cầu preflight (OPTIONS request) tới route root "/"
            .set('Origin', 'http://example.com'); // Thiết lập header Origin;

        expect(response.status).toBe(204);
        expect(response.headers['access-control-allow-methods']).toBe('GET,PUT,PATCH,POST,DELETE,OPTIONS');
    }, 10000);
    it('Returns 404 when the route requested is not found.', async () => {
        const response = await request(application).get('/a/cute/route/that/does/not/exist/');

        expect(response.status).toBe(404);
    }, 10000);
});
