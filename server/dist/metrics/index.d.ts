import client from 'prom-client';
export declare const register: client.Registry<"text/plain; version=0.0.4; charset=utf-8">;
export declare const httpRequestsTotal: client.Counter<"method" | "route" | "status_code">;
export declare const httpRequestDurationMs: client.Histogram<"method" | "route" | "status_code">;
export declare const activeConnections: client.Gauge<string>;
export declare const api_errors_total: client.Counter<"type">;
//# sourceMappingURL=index.d.ts.map