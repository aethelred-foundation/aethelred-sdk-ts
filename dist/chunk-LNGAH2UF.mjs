// src/integrations/nextjs.ts
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
  return createHash("sha256").update(canonical).digest("hex");
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
    traceId: randomUUID(),
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
      traceId: randomUUID(),
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

export {
  withAethelredApiRoute,
  withAethelredRouteHandler,
  __internal
};
