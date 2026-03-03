// src/integrations/nextjs-middleware.ts
import { createHash, randomUUID } from "crypto";
function stableNormalize(value) {
  if (value === null || value === void 0) return value ?? null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return { __bytes__: value.toString("base64") };
  }
  if (value instanceof Uint8Array) {
    return { __bytes__: Buffer.from(value).toString("base64") };
  }
  if (Array.isArray(value)) {
    return value.map(stableNormalize);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value && typeof value === "object") {
    const maybeSerializable = value;
    if (typeof maybeSerializable.toJSON === "function") {
      try {
        return stableNormalize(maybeSerializable.toJSON());
      } catch {
      }
    }
    const out = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = stableNormalize(value[key]);
    }
    return out;
  }
  return String(value);
}
function hashPayload(value) {
  return createHash("sha256").update(JSON.stringify(stableNormalize(value))).digest("hex");
}
function normalizedPrefix(prefix) {
  return (prefix ?? "x-aethelred").toLowerCase().replace(/-+$/, "");
}
function fireAndForget(hook, envelope) {
  if (!hook) return;
  Promise.resolve(hook(envelope)).catch(() => void 0);
}
function setHeaders(response, envelope, prefix) {
  const p = normalizedPrefix(prefix);
  response.headers.set(`${p}-trace-id`, envelope.traceId);
  response.headers.set(`${p}-framework`, envelope.framework);
  response.headers.set(`${p}-operation`, envelope.operation);
  response.headers.set(`${p}-input-hash`, envelope.inputHash);
  response.headers.set(`${p}-output-hash`, envelope.outputHash);
  response.headers.set(`${p}-ts-ms`, String(envelope.timestampMs));
}
function requestMetadata(request) {
  const url = request.nextUrl?.href ?? request.url ?? "";
  const pathname = request.nextUrl?.pathname ?? void 0;
  const search = request.nextUrl?.search ?? void 0;
  const headers = request.headers ? Object.fromEntries(request.headers.entries()) : {};
  return {
    method: request.method ?? "GET",
    url,
    pathname,
    search,
    headers
  };
}
function withAethelredMiddleware(handler, options = {}) {
  return async (request, event) => {
    const inputData = requestMetadata(request);
    let response = await handler(request, event);
    if (!(response instanceof Response)) {
      response = new Response(null, { status: 204 });
    }
    let responseBody = null;
    try {
      responseBody = await response.clone().text();
    } catch {
      responseBody = { stream: true };
    }
    const envelope = {
      traceId: randomUUID(),
      framework: "nextjs",
      operation: "middleware",
      inputHash: hashPayload(inputData),
      outputHash: hashPayload({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody
      }),
      timestampMs: Date.now(),
      metadata: {
        service: options.service ?? "nextjs-middleware",
        component: options.component ?? "middleware",
        matcherId: options.matcherId ?? null,
        statusCode: response.status
      }
    };
    setHeaders(response, envelope, options.headerPrefix);
    fireAndForget(options.onRecord, envelope);
    return response;
  };
}
var __internal = {
  hashPayload,
  stableNormalize,
  requestMetadata
};

export {
  withAethelredMiddleware,
  __internal
};
