// src/lib/cors.ts
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

const DEFAULT_DEV_ORIGIN = "http://localhost:4321";
const DEFAULT_PROD_ORIGIN = "https://ioit-cybershield.github.io";

export const SITE_ORIGIN =
  process.env.PUBLICSITEORIGIN ??
  (process.env.NODE_ENV === "production"
    ? DEFAULT_PROD_ORIGIN
    : DEFAULT_DEV_ORIGIN);

export function buildCorsHeaders(methods: HttpMethod[]): HeadersInit {
  return {
    "Access-Control-Allow-Origin": SITE_ORIGIN,
    "Access-Control-Allow-Methods": methods.join(", "),
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
