"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_errors_total = exports.activeConnections = exports.httpRequestDurationMs = exports.httpRequestsTotal = exports.register = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
exports.register = new prom_client_1.default.Registry();
// Domyślne metryki Node.js – CPU, RAM, event loop, GC
prom_client_1.default.collectDefaultMetrics({ register: exports.register });
// Licznik żądań HTTP
exports.httpRequestsTotal = new prom_client_1.default.Counter({
    name: 'http_requests_total',
    help: 'Łączna liczba żądań HTTP',
    labelNames: ['method', 'route', 'status_code'],
    registers: [exports.register],
});
// Histogram czasu odpowiedzi (ms)
exports.httpRequestDurationMs = new prom_client_1.default.Histogram({
    name: 'http_request_duration_ms',
    help: 'Czas trwania żądania w milisekundach',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000],
    registers: [exports.register],
});
// Gauge aktywnych połączeń
exports.activeConnections = new prom_client_1.default.Gauge({
    name: 'active_connections',
    help: 'Liczba aktualnie obsługiwanych połączeń',
    registers: [exports.register],
});
// Własna metryka
exports.api_errors_total = new prom_client_1.default.Counter({
    name: 'api_errors_total',
    help: 'Liczba błędów API 400 i 404',
    labelNames: ['type'],
    registers: [exports.register],
});
//# sourceMappingURL=index.js.map