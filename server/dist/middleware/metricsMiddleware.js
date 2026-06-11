"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = metricsMiddleware;
const index_1 = require("../metrics/index");
function metricsMiddleware(req, res, next) {
    const startMs = Date.now();
    index_1.activeConnections.inc();
    res.on('finish', () => {
        const durationMs = Date.now() - startMs;
        const route = req.route?.path ?? req.path;
        const labels = { method: req.method, route, status_code: String(res.statusCode) };
        index_1.httpRequestsTotal.inc(labels);
        index_1.httpRequestDurationMs.observe(labels, durationMs);
        index_1.activeConnections.dec();
    });
    next();
}
//# sourceMappingURL=metricsMiddleware.js.map