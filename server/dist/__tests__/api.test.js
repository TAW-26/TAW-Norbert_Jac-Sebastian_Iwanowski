"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
(0, globals_1.describe)("Testy API - Autoryzacja i Zabezpieczenia", () => {
    // 1. Test działania serwera (Healthcheck)
    (0, globals_1.test)("GET / - weryfikacja healthcheck (200)", async () => {
        const response = await (0, supertest_1.default)(index_1.default).get("/");
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.text).toContain("Backend działa poprawnie!");
    });
    // 2. Test bezpieczeństwa logowania
    (0, globals_1.test)("POST /auth/login - błędne poświadczenia (401)", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/api/auth/login")
            .send({ email: "fake@email.com", password: "zle_haslo_123" });
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body.error).toBe("Nieprawidłowy email lub hasło.");
    });
    // 3. Test ochrony tras przed niezalogowanymi
    (0, globals_1.test)("GET /users/me - brak tokena JWT (401)", async () => {
        const response = await (0, supertest_1.default)(index_1.default).get("/api/users/me");
        (0, globals_1.expect)(response.status).toBe(401);
        (0, globals_1.expect)(response.body.error).toBe("Brak dostępu. Musisz być zalogowany!");
    });
    // 4. Test weryfikacji uszkodzonego tokena w generatorze AI
    (0, globals_1.test)("POST /trips/generate - nieważny token (403)", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/api/trips/generate")
            .set("Authorization", "Bearer zmyslony.token.jwt");
        (0, globals_1.expect)(response.status).toBe(403);
        (0, globals_1.expect)(response.body.error).toBe("Token jest nieważny lub wygasł.");
    });
    // 5. Test wymogu podania danych logowania
    (0, globals_1.test)("POST /auth/login - walidacja brakujących pól (401)", async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post("/api/auth/login")
            .send({ password: "tylkohaslo" });
        (0, globals_1.expect)(response.status).toBe(401);
    });
});
//# sourceMappingURL=api.test.js.map