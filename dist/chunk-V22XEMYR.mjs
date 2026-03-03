// src/core/errors.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2[ErrorCode2["UNKNOWN"] = 1e3] = "UNKNOWN";
  ErrorCode2[ErrorCode2["INTERNAL"] = 1001] = "INTERNAL";
  ErrorCode2[ErrorCode2["INVALID_ARGUMENT"] = 1002] = "INVALID_ARGUMENT";
  ErrorCode2[ErrorCode2["NOT_FOUND"] = 1003] = "NOT_FOUND";
  ErrorCode2[ErrorCode2["ALREADY_EXISTS"] = 1004] = "ALREADY_EXISTS";
  ErrorCode2[ErrorCode2["PERMISSION_DENIED"] = 1005] = "PERMISSION_DENIED";
  ErrorCode2[ErrorCode2["CONNECTION_FAILED"] = 1100] = "CONNECTION_FAILED";
  ErrorCode2[ErrorCode2["CONNECTION_TIMEOUT"] = 1101] = "CONNECTION_TIMEOUT";
  ErrorCode2[ErrorCode2["AUTHENTICATION_REQUIRED"] = 1200] = "AUTHENTICATION_REQUIRED";
  ErrorCode2[ErrorCode2["INVALID_API_KEY"] = 1201] = "INVALID_API_KEY";
  ErrorCode2[ErrorCode2["RATE_LIMITED"] = 1300] = "RATE_LIMITED";
  ErrorCode2[ErrorCode2["TRANSACTION_FAILED"] = 1400] = "TRANSACTION_FAILED";
  ErrorCode2[ErrorCode2["INSUFFICIENT_FUNDS"] = 1401] = "INSUFFICIENT_FUNDS";
  ErrorCode2[ErrorCode2["JOB_NOT_FOUND"] = 1500] = "JOB_NOT_FOUND";
  ErrorCode2[ErrorCode2["JOB_FAILED"] = 1504] = "JOB_FAILED";
  ErrorCode2[ErrorCode2["SEAL_NOT_FOUND"] = 1600] = "SEAL_NOT_FOUND";
  ErrorCode2[ErrorCode2["SEAL_VERIFICATION_FAILED"] = 1604] = "SEAL_VERIFICATION_FAILED";
  ErrorCode2[ErrorCode2["MODEL_NOT_FOUND"] = 1700] = "MODEL_NOT_FOUND";
  ErrorCode2[ErrorCode2["VERIFICATION_FAILED"] = 1800] = "VERIFICATION_FAILED";
  ErrorCode2[ErrorCode2["VALIDATION_FAILED"] = 1900] = "VALIDATION_FAILED";
  return ErrorCode2;
})(ErrorCode || {});
var AethelredError = class _AethelredError extends Error {
  code;
  details;
  cause;
  constructor(message, code = 1e3 /* UNKNOWN */, details = {}, cause) {
    super(message);
    this.name = "AethelredError";
    this.code = code;
    this.details = details;
    this.cause = cause;
    Object.setPrototypeOf(this, _AethelredError.prototype);
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      codeName: ErrorCode[this.code],
      details: this.details
    };
  }
};
var ConnectionError = class extends AethelredError {
  constructor(message = "Failed to connect", cause) {
    super(message, 1100 /* CONNECTION_FAILED */, {}, cause);
    this.name = "ConnectionError";
  }
};
var AuthenticationError = class extends AethelredError {
  constructor(message = "Authentication failed") {
    super(message, 1200 /* AUTHENTICATION_REQUIRED */);
    this.name = "AuthenticationError";
  }
};
var RateLimitError = class extends AethelredError {
  retryAfter;
  constructor(message = "Rate limit exceeded", retryAfter) {
    super(message, 1300 /* RATE_LIMITED */, { retryAfter });
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
};
var TransactionError = class extends AethelredError {
  txHash;
  constructor(message = "Transaction failed", txHash, code = 1400 /* TRANSACTION_FAILED */) {
    super(message, code, { txHash });
    this.name = "TransactionError";
    this.txHash = txHash;
  }
};
var JobError = class extends AethelredError {
  jobId;
  constructor(message = "Job operation failed", jobId, code = 1504 /* JOB_FAILED */) {
    super(message, code, { jobId });
    this.name = "JobError";
    this.jobId = jobId;
  }
};
var SealError = class extends AethelredError {
  sealId;
  constructor(message = "Seal operation failed", sealId, code = 1600 /* SEAL_NOT_FOUND */) {
    super(message, code, { sealId });
    this.name = "SealError";
    this.sealId = sealId;
  }
};
var ValidationError = class extends AethelredError {
  field;
  constructor(message = "Validation failed", field) {
    super(message, 1900 /* VALIDATION_FAILED */, { field });
    this.name = "ValidationError";
    this.field = field;
  }
};
var TimeoutError = class extends AethelredError {
  constructor(message = "Operation timed out", timeoutMs) {
    super(message, 1101 /* CONNECTION_TIMEOUT */, { timeoutMs });
    this.name = "TimeoutError";
  }
};

// src/jobs/index.ts
var JobsModule = class {
  constructor(client) {
    this.client = client;
  }
  basePath = "/aethelred/pouw/v1";
  async submit(request) {
    return this.client.post(`${this.basePath}/jobs`, request);
  }
  async get(jobId) {
    const data = await this.client.get(`${this.basePath}/jobs/${jobId}`);
    return data.job;
  }
  async list(options) {
    const data = await this.client.get(`${this.basePath}/jobs`, options);
    return data.jobs || [];
  }
  async listPending(pagination) {
    const query = pagination ? { ...pagination } : void 0;
    const data = await this.client.get(`${this.basePath}/jobs/pending`, query);
    return data.jobs || [];
  }
  async cancel(jobId) {
    await this.client.post(`${this.basePath}/jobs/${jobId}/cancel`);
    return true;
  }
  async waitForCompletion(jobId, options) {
    const pollInterval = options?.pollInterval ?? 2e3;
    const timeout = options?.timeout ?? 3e5;
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const job = await this.get(jobId);
      if (["JOB_STATUS_COMPLETED" /* COMPLETED */, "JOB_STATUS_FAILED" /* FAILED */, "JOB_STATUS_CANCELLED" /* CANCELLED */].includes(job.status)) {
        return job;
      }
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
    throw new TimeoutError(`Job ${jobId} did not complete within ${timeout}ms`);
  }
};

export {
  ErrorCode,
  AethelredError,
  ConnectionError,
  AuthenticationError,
  RateLimitError,
  TransactionError,
  JobError,
  SealError,
  ValidationError,
  TimeoutError,
  JobsModule
};
