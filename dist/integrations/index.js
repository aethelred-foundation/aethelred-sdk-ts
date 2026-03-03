"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/integrations/index.ts
var integrations_exports = {};
__export(integrations_exports, {
  __internal: () => __internal,
  withAethelredApiRoute: () => withAethelredApiRoute,
  withAethelredMiddleware: () => withAethelredMiddleware,
  withAethelredRouteHandler: () => withAethelredRouteHandler
});
module.exports = __toCommonJS(integrations_exports);

// src/integrations/nextjs.ts
var import_node_crypto = require("crypto");
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
    const maybeModel = value;
    if (typeof maybeModel.toJSON === "function") {
      try {
        return stableNormalize(maybeModel.toJSON());
      } catch {
      }
    }
    const obj = value;
    const out = {};
    for (const key of Object.keys(obj).sort()) {
      out[key] = stableNormalize(obj[key]);
    }
    return out;
  }
  return String(value);
}
function hashPayload(value) {
  const canonical = JSON.stringify(stableNormalize(value));
  return (0, import_node_crypto.createHash)("sha256").update(canonical).digest("hex");
}
function normalizedPrefix(prefix) {
  return (prefix ?? "x-aethelred").toLowerCase().replace(/-+$/, "");
}
function fireAndForget(hook, envelope) {
  if (!hook) return;
  Promise.resolve(hook(envelope)).catch(() => {
  });
}
function buildEnvelope(inputData, outputData, metadata) {
  return {
    traceId: (0, import_node_crypto.randomUUID)(),
    framework: "nextjs",
    operation: "api.route",
    inputHash: hashPayload(inputData),
    outputHash: hashPayload(outputData),
    timestampMs: Date.now(),
    metadata
  };
}
function setVerificationHeaders(resLike, envelope, headerPrefix) {
  const prefix = normalizedPrefix(headerPrefix);
  resLike.setHeader(`${prefix}-trace-id`, envelope.traceId);
  resLike.setHeader(`${prefix}-framework`, envelope.framework);
  resLike.setHeader(`${prefix}-operation`, envelope.operation);
  resLike.setHeader(`${prefix}-input-hash`, envelope.inputHash);
  resLike.setHeader(`${prefix}-output-hash`, envelope.outputHash);
  resLike.setHeader(`${prefix}-ts-ms`, String(envelope.timestampMs));
}
function withAethelredApiRoute(handler, options = {}) {
  return async (req, res) => {
    const inputData = {
      method: req.method,
      url: req.url,
      headers: req.headers ?? {},
      query: req.query ?? null,
      body: req.body ?? null
    };
    const baseMetadata = {
      service: options.service ?? "nextjs-api",
      component: options.component ?? "api-route"
    };
    let recorded = false;
    const originalJson = res.json?.bind(res);
    const originalSend = res.send?.bind(res);
    const originalEnd = res.end?.bind(res);
    const recordResponse = (outputData, operation = "api.route") => {
      if (recorded) return;
      recorded = true;
      const envelope = buildEnvelope(inputData, outputData, {
        ...baseMetadata,
        operation,
        statusCode: res.statusCode ?? 200
      });
      setVerificationHeaders(res, envelope, options.headerPrefix);
      fireAndForget(options.onRecord, envelope);
    };
    if (originalJson) {
      res.json = ((body) => {
        recordResponse(body, "api.route.json");
        return originalJson(body);
      });
    }
    if (originalSend) {
      res.send = ((body) => {
        recordResponse(body, "api.route.send");
        return originalSend(body);
      });
    }
    if (originalEnd) {
      res.end = ((chunk) => {
        recordResponse(chunk ?? { ended: true }, "api.route.end");
        return originalEnd(chunk);
      });
    }
    try {
      const result = await handler(req, res);
      if (!recorded && result !== void 0) {
        recordResponse(result, "api.route.return");
      }
      return result;
    } catch (error) {
      if (!recorded) {
        recordResponse(
          { error: error instanceof Error ? error.message : String(error) },
          "api.route.error"
        );
      }
      throw error;
    }
  };
}
function withAethelredRouteHandler(handler, options = {}) {
  return async (request, context) => {
    let requestBody = null;
    try {
      const clone = request.clone();
      const text = await clone.text();
      requestBody = text;
    } catch {
      requestBody = { stream: true };
    }
    const response = await handler(request, context);
    let responseBody = null;
    try {
      const clone = response.clone();
      responseBody = await clone.text();
    } catch {
      responseBody = { stream: true };
    }
    const inputData = {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      body: requestBody
    };
    const envelope = {
      traceId: (0, import_node_crypto.randomUUID)(),
      framework: "nextjs",
      operation: "app.route",
      inputHash: hashPayload(inputData),
      outputHash: hashPayload({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody
      }),
      timestampMs: Date.now(),
      metadata: {
        service: options.service ?? "nextjs-app-route",
        component: options.component ?? "route-handler",
        statusCode: response.status
      }
    };
    const prefix = normalizedPrefix(options.headerPrefix);
    response.headers.set(`${prefix}-trace-id`, envelope.traceId);
    response.headers.set(`${prefix}-framework`, envelope.framework);
    response.headers.set(`${prefix}-operation`, envelope.operation);
    response.headers.set(`${prefix}-input-hash`, envelope.inputHash);
    response.headers.set(`${prefix}-output-hash`, envelope.outputHash);
    response.headers.set(`${prefix}-ts-ms`, String(envelope.timestampMs));
    fireAndForget(options.onRecord, envelope);
    return response;
  };
}
var __internal = {
  hashPayload,
  stableNormalize
};

// src/integrations/nextjs-middleware.ts
var import_node_crypto2 = require("crypto");
function stableNormalize2(value) {
  if (value === null || value === void 0) return value ?? null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return { __bytes__: value.toString("base64") };
  }
  if (value instanceof Uint8Array) {
    return { __bytes__: Buffer.from(value).toString("base64") };
  }
  if (Array.isArray(value)) {
    return value.map(stableNormalize2);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value && typeof value === "object") {
    const maybeSerializable = value;
    if (typeof maybeSerializable.toJSON === "function") {
      try {
        return stableNormalize2(maybeSerializable.toJSON());
      } catch {
      }
    }
    const out = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = stableNormalize2(value[key]);
    }
    return out;
  }
  return String(value);
}
function hashPayload2(value) {
  return (0, import_node_crypto2.createHash)("sha256").update(JSON.stringify(stableNormalize2(value))).digest("hex");
}
function normalizedPrefix2(prefix) {
  return (prefix ?? "x-aethelred").toLowerCase().replace(/-+$/, "");
}
function fireAndForget2(hook, envelope) {
  if (!hook) return;
  Promise.resolve(hook(envelope)).catch(() => void 0);
}
function setHeaders(response, envelope, prefix) {
  const p = normalizedPrefix2(prefix);
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
      traceId: (0, import_node_crypto2.randomUUID)(),
      framework: "nextjs",
      operation: "middleware",
      inputHash: hashPayload2(inputData),
      outputHash: hashPayload2({
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
    fireAndForget2(options.onRecord, envelope);
    return response;
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __internal,
  withAethelredApiRoute,
  withAethelredMiddleware,
  withAethelredRouteHandler
});
