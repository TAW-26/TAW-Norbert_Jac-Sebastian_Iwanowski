import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../index';

describe('Testy API - Autoryzacja i Zabezpieczenia', () => {

    // 1. Test działania serwera (Healthcheck)
    test('GET / - weryfikacja healthcheck (200)', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Backend działa poprawnie!');
    });

    // 2. Test bezpieczeństwa logowania
    test('POST /auth/login - błędne poświadczenia (401)', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'fake@email.com', password: 'zle_haslo_123' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Nieprawidłowy email lub hasło.');
    });

    // 3. Test ochrony tras przed niezalogowanymi
    test('GET /users/me - brak tokena JWT (401)', async () => {
        const response = await request(app).get('/api/users/me');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Brak dostępu. Musisz być zalogowany!');
    });

    // 4. Test weryfikacji uszkodzonego tokena w generatorze AI
    test('POST /trips/generate - nieważny token (403)', async () => {
        const response = await request(app)
            .post('/api/trips/generate')
            .set('Authorization', 'Bearer zmyslony.token.jwt');

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Token jest nieważny lub wygasł.');
    });

    // 5. Test wymogu podania danych logowania
    test('POST /auth/login - walidacja brakujących pól (401)', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ password: 'tylkohaslo' });

        expect(response.status).toBe(401);
    });

});