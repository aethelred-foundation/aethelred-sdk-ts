import "../chunk-74DCVGBD.mjs";

// src/react/index.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const runningRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const run = useCallback(async () => {
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
  useEffect(() => {
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
  return useMemo(
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
  const fetcher = useMemo(() => {
    if (!client || !sealId) return void 0;
    return async () => client.seals.get(sealId);
  }, [client, sealId]);
  return useAethelredQuery(fetcher, [client, sealId], {
    ...options,
    enabled: (options.enabled ?? true) && Boolean(client && sealId)
  });
}
function useSealVerification(client, sealId, options = {}) {
  const fetcher = useMemo(() => {
    if (!client || !sealId) return void 0;
    return async () => client.seals.verify(sealId);
  }, [client, sealId]);
  return useAethelredQuery(fetcher, [client, sealId], {
    ...options,
    enabled: (options.enabled ?? true) && Boolean(client && sealId)
  });
}
function useJob(client, jobId, options = {}) {
  const [terminal, setTerminal] = useState(false);
  const fetcher = useMemo(() => {
    if (!client || !jobId) return void 0;
    return async () => {
      const job = await client.jobs.get(jobId);
      if (options.stopOnTerminal !== false && isTerminalJobStatus(job.status)) {
        setTerminal(true);
      }
      return job;
    };
  }, [client, jobId, options.stopOnTerminal]);
  useEffect(() => {
    setTerminal(false);
  }, [jobId]);
  return useAethelredQuery(fetcher, [client, jobId, terminal], {
    ...options,
    pollIntervalMs: terminal ? void 0 : options.pollIntervalMs,
    enabled: (options.enabled ?? true) && Boolean(client && jobId)
  });
}
export {
  useAethelredQuery,
  useJob,
  useSeal,
  useSealVerification
};
