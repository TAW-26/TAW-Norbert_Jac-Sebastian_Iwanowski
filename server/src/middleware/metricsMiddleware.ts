import { httpRequestsTotal, httpRequestDurationMs, activeConnections } from '../metrics/index';

export function metricsMiddleware(req: any, res: any, next: any) {
    const startMs = Date.now();
    activeConnections.inc();

    res.on('finish', () => {
        const durationMs = Date.now() - startMs;
        const route = req.route?.path ?? req.path;
        const labels = { method: req.method, route, status_code: String(res.statusCode) };

        httpRequestsTotal.inc(labels);
        httpRequestDurationMs.observe(labels, durationMs);
        activeConnections.dec();
    });

    next();
}