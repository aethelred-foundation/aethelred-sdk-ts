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

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  useAethelredQuery: () => useAethelredQuery,
  useJob: () => useJob,
  useSeal: () => useSeal,
  useSealVerification: () => useSealVerification
});
module.exports = __toCommonJS(react_exports);
var import_react = require("react");

// src/react/utils.ts
function isTerminalJobStatus(status) {
  return Boolean(status && ["JOB_STATUS_COMPLETED" /* COMPLETED */, "JOB_STATUS_FAILED" /* FAILED */, "JOB_STATUS_CANCELLED" /* CANCELLED */].includes(status));
}

// src/react/index.ts
function asError(error) {
  return error instanceof Error ? error : new Error(String(error));
}
function useAethelredQuery(fetcher, deps, options = {}) {
  const enabled = options.enabled ?? true;
  const immediate = options.immediate ?? true;
  const pollIntervalMs = options.pollIntervalMs;
  const [status, setStatus] = (0, import_react.useState)("idle");
  const [data, setData] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const mountedRef = (0, import_react.useRef)(true);
  const runningRef = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const run = (0, import_react.useCallback)(async () => {
    if (!enabled || !fetcher || runningRef.current) return;
    runningRef.current = true;
    setStatus((prev) => prev === "success" ? prev : "loading");
    setError(null);
    try {
      const result = await fetcher();
      if (!mountedRef.current) return;
      setData(result);
      setStatus("success");
    } catch (e) {
      if (!mountedRef.current) return;
      setError(asError(e));
      setStatus("error");
    } finally {
      runningRef.current = false;
    }
  }, [enabled, fetcher]);
  (0, import_react.useEffect)(() => {
    if (!enabled || !fetcher) {
      setStatus("idle");
      return;
    }
    if (immediate) {
      void run();
    }
    if (!pollIntervalMs || pollIntervalMs <= 0) return;
    const id = setInterval(() => void run(), pollIntervalMs);
    return () => clearInterval(id);
  }, [enabled, fetcher, immediate, pollIntervalMs, run, ...deps]);
  return (0, import_react.useMemo)(
    () => ({
      status,
      data,
      error,
      loading: status === "loading",
      refresh: run
    }),
    [status, data, error, run]
  );
}
function useSeal(client, sealId, options = {}) {
  const fetcher = (0, import_react.useMemo)(() => {
    if (!client || !sealId) return void 0;
    return async () => client.seals.get(sealId);
  }, [client, sealId]);
  return useAethelredQuery(fetcher, [client, sealId], {
    ...options,
    enabled: (options.enabled ?? true) && Boolean(client && sealId)
  });
}
function useSealVerification(client, sealId, options = {}) {
  const fetcher = (0, import_react.useMemo)(() => {
    if (!client || !sealId) return void 0;
    return async () => client.seals.verify(sealId);
  }, [client, sealId]);
  return useAethelredQuery(fetcher, [client, sealId], {
    ...options,
    enabled: (options.enabled ?? true) && Boolean(client && sealId)
  });
}
function useJob(client, jobId, options = {}) {
  const [terminal, setTerminal] = (0, import_react.useState)(false);
  const fetcher = (0, import_react.useMemo)(() => {
    if (!client || !jobId) return void 0;
    return async () => {
      const job = await client.jobs.get(jobId);
      if (options.stopOnTerminal !== false && isTerminalJobStatus(job.status)) {
        setTerminal(true);
      }
      return job;
    };
  }, [client, jobId, options.stopOnTerminal]);
  (0, import_react.useEffect)(() => {
    setTerminal(false);
  }, [jobId]);
  return useAethelredQuery(fetcher, [client, jobId, terminal], {
    ...options,
    pollIntervalMs: terminal ? void 0 : options.pollIntervalMs,
    enabled: (options.enabled ?? true) && Boolean(client && jobId)
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAethelredQuery,
  useJob,
  useSeal,
  useSealVerification
});
