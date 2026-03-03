"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AUTHOR: () => AUTHOR,
  AethelredClient: () => AethelredClient,
  AethelredError: () => AethelredError,
  AuthenticationError: () => AuthenticationError,
  ConnectionError: () => ConnectionError,
  ErrorCode: () => ErrorCode,
  JobError: () => JobError,
  JobStatus: () => JobStatus,
  JobsModule: () => JobsModule,
  LICENSE: () => LICENSE,
  ModelsModule: () => ModelsModule,
  Network: () => Network,
  ProofSystem: () => ProofSystem,
  ProofType: () => ProofType,
  RateLimitError: () => RateLimitError,
  SealError: () => SealError,
  SealStatus: () => SealStatus,
  SealsModule: () => SealsModule,
  TEEPlatform: () => TEEPlatform,
  TimeoutError: () => TimeoutError,
  TransactionError: () => TransactionError,
  UtilityCategory: () => UtilityCategory,
  VERSION: () => VERSION,
  ValidationError: () => ValidationError,
  ValidatorsModule: () => ValidatorsModule,
  VerificationModule: () => VerificationModule,
  canonicalizeSeal: () => canonicalizeSeal,
  default: () => index_default,
  fingerprintSealSha256: () => fingerprintSealSha256,
  parseSealInput: () => parseSealInput,
  verifySealOffline: () => verifySealOffline,
  withAethelredApiRoute: () => withAethelredApiRoute,
  withAethelredMiddleware: () => withAethelredMiddleware,
  withAethelredNextMiddleware: () => withAethelredMiddleware,
  withAethelredRouteHandler: () => withAethelredRouteHandler
});
module.exports = __toCommonJS(index_exports);

// src/core/client.ts
var import_axios = __toESM(require("axios"));

// src/core/config.ts
var Network = /* @__PURE__ */ ((Network2) => {
  Network2["MAINNET"] = "mainnet";
  Network2["TESTNET"] = "testnet";
  Network2["DEVNET"] = "devnet";
  Network2["LOCAL"] = "local";
  return Network2;
})(Network || {});
var NETWORK_CONFIGS = {
  ["mainnet" /* MAINNET */]: {
    rpcUrl: "https://rpc.mainnet.aethelred.org",
    chainId: "aethelred-1",
    wsUrl: "wss://ws.mainnet.aethelred.org",
    grpcUrl: "grpc.mainnet.aethelred.org:9090",
    restUrl: "https://api.mainnet.aethelred.org",
    explorerUrl: "https://explorer.aethelred.org"
  },
  ["testnet" /* TESTNET */]: {
    rpcUrl: "https://rpc.testnet.aethelred.org",
    chainId: "aethelred-testnet-1",
    wsUrl: "wss://ws.testnet.aethelred.org",
    grpcUrl: "grpc.testnet.aethelred.org:9090",
    restUrl: "https://api.testnet.aethelred.org",
    explorerUrl: "https://testnet.explorer.aethelred.org"
  },
  ["devnet" /* DEVNET */]: {
    rpcUrl: "https://rpc.devnet.aethelred.org",
    chainId: "aethelred-devnet-1",
    wsUrl: "wss://ws.devnet.aethelred.org",
    grpcUrl: "grpc.devnet.aethelred.org:9090",
    restUrl: "https://api.devnet.aethelred.org",
    explorerUrl: "https://devnet.explorer.aethelred.org"
  },
  ["local" /* LOCAL */]: {
    rpcUrl: "http://127.0.0.1:26657",
    chainId: "aethelred-local",
    wsUrl: "ws://127.0.0.1:26657/websocket",
    grpcUrl: "127.0.0.1:9090",
    restUrl: "http://127.0.0.1:1317"
  }
};
var DEFAULT_CONFIG = {
  network: "mainnet" /* MAINNET */,
  timeout: { connect: 1e4, read: 3e4, write: 3e4 },
  retry: { maxRetries: 3, initialDelay: 500, maxDelay: 3e4, exponentialBase: 2 },
  maxConnections: 10,
  wsEnabled: true,
  logLevel: "info",
  logRequests: false
};
function resolveConfig(config) {
  const network = config.network ?? DEFAULT_CONFIG.network;
  const networkConfig = NETWORK_CONFIGS[network];
  const timeout = {
    ...DEFAULT_CONFIG.timeout,
    ...config.timeout ?? {}
  };
  const retry = {
    ...DEFAULT_CONFIG.retry,
    ...config.retry ?? {}
  };
  return {
    ...DEFAULT_CONFIG,
    ...config,
    timeout,
    retry,
    network,
    rpcUrl: config.rpcUrl ?? networkConfig.rpcUrl,
    chainId: config.chainId ?? networkConfig.chainId,
    apiKey: config.apiKey,
    privateKey: config.privateKey,
    networkConfig
  };
}

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

// src/core/types.ts
var JobStatus = /* @__PURE__ */ ((JobStatus2) => {
  JobStatus2["UNSPECIFIED"] = "JOB_STATUS_UNSPECIFIED";
  JobStatus2["PENDING"] = "JOB_STATUS_PENDING";
  JobStatus2["ASSIGNED"] = "JOB_STATUS_ASSIGNED";
  JobStatus2["COMPUTING"] = "JOB_STATUS_COMPUTING";
  JobStatus2["VERIFYING"] = "JOB_STATUS_VERIFYING";
  JobStatus2["COMPLETED"] = "JOB_STATUS_COMPLETED";
  JobStatus2["FAILED"] = "JOB_STATUS_FAILED";
  JobStatus2["CANCELLED"] = "JOB_STATUS_CANCELLED";
  JobStatus2["EXPIRED"] = "JOB_STATUS_EXPIRED";
  return JobStatus2;
})(JobStatus || {});
var SealStatus = /* @__PURE__ */ ((SealStatus2) => {
  SealStatus2["UNSPECIFIED"] = "SEAL_STATUS_UNSPECIFIED";
  SealStatus2["ACTIVE"] = "SEAL_STATUS_ACTIVE";
  SealStatus2["REVOKED"] = "SEAL_STATUS_REVOKED";
  SealStatus2["EXPIRED"] = "SEAL_STATUS_EXPIRED";
  SealStatus2["SUPERSEDED"] = "SEAL_STATUS_SUPERSEDED";
  return SealStatus2;
})(SealStatus || {});
var ProofType = /* @__PURE__ */ ((ProofType2) => {
  ProofType2["UNSPECIFIED"] = "PROOF_TYPE_UNSPECIFIED";
  ProofType2["TEE"] = "PROOF_TYPE_TEE";
  ProofType2["ZKML"] = "PROOF_TYPE_ZKML";
  ProofType2["HYBRID"] = "PROOF_TYPE_HYBRID";
  ProofType2["OPTIMISTIC"] = "PROOF_TYPE_OPTIMISTIC";
  return ProofType2;
})(ProofType || {});
var ProofSystem = /* @__PURE__ */ ((ProofSystem2) => {
  ProofSystem2["UNSPECIFIED"] = "PROOF_SYSTEM_UNSPECIFIED";
  ProofSystem2["GROTH16"] = "PROOF_SYSTEM_GROTH16";
  ProofSystem2["PLONK"] = "PROOF_SYSTEM_PLONK";
  ProofSystem2["STARK"] = "PROOF_SYSTEM_STARK";
  ProofSystem2["EZKL"] = "PROOF_SYSTEM_EZKL";
  return ProofSystem2;
})(ProofSystem || {});
var TEEPlatform = /* @__PURE__ */ ((TEEPlatform2) => {
  TEEPlatform2["UNSPECIFIED"] = "TEE_PLATFORM_UNSPECIFIED";
  TEEPlatform2["INTEL_SGX"] = "TEE_PLATFORM_INTEL_SGX";
  TEEPlatform2["AMD_SEV"] = "TEE_PLATFORM_AMD_SEV";
  TEEPlatform2["AWS_NITRO"] = "TEE_PLATFORM_AWS_NITRO";
  TEEPlatform2["ARM_TRUSTZONE"] = "TEE_PLATFORM_ARM_TRUSTZONE";
  return TEEPlatform2;
})(TEEPlatform || {});
var UtilityCategory = /* @__PURE__ */ ((UtilityCategory2) => {
  UtilityCategory2["UNSPECIFIED"] = "UTILITY_CATEGORY_UNSPECIFIED";
  UtilityCategory2["MEDICAL"] = "UTILITY_CATEGORY_MEDICAL";
  UtilityCategory2["SCIENTIFIC"] = "UTILITY_CATEGORY_SCIENTIFIC";
  UtilityCategory2["FINANCIAL"] = "UTILITY_CATEGORY_FINANCIAL";
  UtilityCategory2["LEGAL"] = "UTILITY_CATEGORY_LEGAL";
  UtilityCategory2["EDUCATIONAL"] = "UTILITY_CATEGORY_EDUCATIONAL";
  UtilityCategory2["ENVIRONMENTAL"] = "UTILITY_CATEGORY_ENVIRONMENTAL";
  UtilityCategory2["GENERAL"] = "UTILITY_CATEGORY_GENERAL";
  return UtilityCategory2;
})(UtilityCategory || {});

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

// src/seals/index.ts
var SealsModule = class {
  constructor(client) {
    this.client = client;
  }
  basePath = "/aethelred/seal/v1";
  async create(request) {
    return this.client.post(`${this.basePath}/seals`, request);
  }
  async get(sealId) {
    const data = await this.client.get(`${this.basePath}/seals/${sealId}`);
    return data.seal;
  }
  async list(options) {
    const data = await this.client.get(`${this.basePath}/seals`, options);
    return data.seals || [];
  }
  async listByModel(modelHash, pagination) {
    const data = await this.client.get(`${this.basePath}/seals/by_model`, { model_hash: modelHash, ...pagination });
    return data.seals || [];
  }
  async verify(sealId) {
    return this.client.get(`${this.basePath}/seals/${sealId}/verify`);
  }
  async revoke(sealId, reason) {
    await this.client.post(`${this.basePath}/seals/${sealId}/revoke`, { reason });
    return true;
  }
  async export(sealId, format = "json") {
    const data = await this.client.get(`${this.basePath}/seals/${sealId}/export`, { format });
    return data.data;
  }
};

// src/models/index.ts
var ModelsModule = class {
  constructor(client) {
    this.client = client;
  }
  basePath = "/aethelred/pouw/v1";
  async register(request) {
    return this.client.post(`${this.basePath}/models`, request);
  }
  async get(modelHash) {
    const data = await this.client.get(`${this.basePath}/models/${modelHash}`);
    return data.model;
  }
  async list(options) {
    const data = await this.client.get(`${this.basePath}/models`, options);
    return data.models || [];
  }
};

// src/validators/index.ts
var ValidatorsModule = class {
  constructor(client) {
    this.client = client;
  }
  basePath = "/aethelred/pouw/v1";
  async getStats(address) {
    return this.client.get(`${this.basePath}/validators/${address}/stats`);
  }
  async list(pagination) {
    const params = pagination ? { ...pagination } : void 0;
    const data = await this.client.get(`${this.basePath}/validators`, params);
    return data.validators || [];
  }
  async registerCapability(address, capability) {
    await this.client.post(`${this.basePath}/validators/${address}/capability`, { hardware_capabilities: capability });
    return true;
  }
};

// src/verification/index.ts
var VerificationModule = class {
  constructor(client) {
    this.client = client;
  }
  basePath = "/aethelred/verify/v1";
  async verifyZKProof(request) {
    return this.client.post(`${this.basePath}/zkproofs:verify`, request);
  }
  async verifyTEEAttestation(attestation, expectedEnclaveHash) {
    return this.client.post(`${this.basePath}/tee/attestation:verify`, {
      attestation,
      expected_enclave_hash: expectedEnclaveHash
    });
  }
};

// src/core/client.ts
var AethelredClient = class {
  config;
  http;
  // Modules
  jobs;
  seals;
  models;
  validators;
  verification;
  constructor(config = {}) {
    if (typeof config === "string") {
      config = { rpcUrl: config };
    }
    this.config = resolveConfig(config);
    this.http = import_axios.default.create({
      baseURL: this.config.rpcUrl,
      timeout: this.config.timeout.read,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "aethelred-sdk-js/1.0.0",
        ...this.config.apiKey && { "X-API-Key": this.config.apiKey }
      }
    });
    this.setupInterceptors();
    this.jobs = new JobsModule(this);
    this.seals = new SealsModule(this);
    this.models = new ModelsModule(this);
    this.validators = new ValidatorsModule(this);
    this.verification = new VerificationModule(this);
  }
  setupInterceptors() {
    this.http.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers["retry-after"];
          throw new RateLimitError("Rate limit exceeded", retryAfter ? parseInt(retryAfter) : void 0);
        }
        if (error.code === "ECONNABORTED") {
          throw new TimeoutError("Request timed out");
        }
        if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
          throw new ConnectionError("Failed to connect to node", error);
        }
        throw new AethelredError(
          error.response?.data?.message || error.message,
          error.response?.status || 1e3,
          error.response?.data || {}
        );
      }
    );
  }
  // HTTP methods
  async get(path, params) {
    const response = await this.http.get(path, { params });
    return response.data;
  }
  async post(path, data) {
    const response = await this.http.post(path, data);
    return response.data;
  }
  async put(path, data) {
    const response = await this.http.put(path, data);
    return response.data;
  }
  async delete(path, params) {
    const response = await this.http.delete(path, { params });
    return response.data;
  }
  // Utility methods
  async getNodeInfo() {
    const data = await this.get("/cosmos/base/tendermint/v1beta1/node_info");
    return data.default_node_info;
  }
  async getLatestBlock() {
    return this.get("/cosmos/base/tendermint/v1beta1/blocks/latest");
  }
  async getBlock(height) {
    return this.get(`/cosmos/base/tendermint/v1beta1/blocks/${height}`);
  }
  async healthCheck() {
    try {
      await this.getNodeInfo();
      return true;
    } catch {
      return false;
    }
  }
  getNetworkConfig() {
    return this.config.networkConfig;
  }
  getRpcUrl() {
    return this.config.rpcUrl;
  }
  getChainId() {
    return this.config.chainId;
  }
};

// src/devtools/seal-verifier.ts
var import_ed25519 = require("@noble/curves/ed25519");
var import_utils = require("@noble/hashes/utils");
var import_sha256 = require("@noble/hashes/sha256");
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeDate(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return void 0;
}
function normalizeValue(value) {
  if (value === void 0) return void 0;
  if (value === null) return null;
  const asDate = normalizeDate(value);
  if (asDate) return asDate;
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  if (isRecord(value)) {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      const normalized = normalizeValue(value[key]);
      if (normalized !== void 0) {
        out[key] = normalized;
      }
    }
    return out;
  }
  return value;
}
function parseSealInput(input) {
  const parsed = typeof input === "string" ? JSON.parse(input) : input;
  if (!isRecord(parsed)) {
    throw new Error("Seal input must be a JSON object");
  }
  if (isRecord(parsed.seal)) {
    return parsed.seal;
  }
  return parsed;
}
function canonicalizeSeal(seal) {
  return JSON.stringify(normalizeValue(seal));
}
function fingerprintSealSha256(seal) {
  const canonical = canonicalizeSeal(seal);
  return `0x${(0, import_utils.bytesToHex)((0, import_sha256.sha256)((0, import_utils.utf8ToBytes)(canonical)))}`;
}
function decodeSigBytes(valueHex, valueBase64) {
  if (valueHex) {
    const trimmed = valueHex.startsWith("0x") ? valueHex.slice(2) : valueHex;
    return (0, import_utils.hexToBytes)(trimmed);
  }
  if (valueBase64) {
    if (typeof Buffer !== "undefined") {
      return Uint8Array.from(Buffer.from(valueBase64, "base64"));
    }
    const binary = atob(valueBase64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  }
  return null;
}
function verifyEd25519Signature(envelope, fingerprintHex, canonicalJson) {
  const publicKey = decodeSigBytes(envelope.publicKeyHex, envelope.publicKeyBase64);
  const signature = decodeSigBytes(envelope.signatureHex, envelope.signatureBase64);
  if (!publicKey || !signature) {
    return { ok: false, message: "Missing public key or signature bytes" };
  }
  const messageMode = envelope.message ?? "fingerprint";
  const payload = messageMode === "canonical-json" ? (0, import_utils.utf8ToBytes)(canonicalJson) : (0, import_utils.hexToBytes)(fingerprintHex.startsWith("0x") ? fingerprintHex.slice(2) : fingerprintHex);
  try {
    const ok = import_ed25519.ed25519.verify(signature, payload, publicKey);
    return {
      ok,
      message: ok ? "Ed25519 signature valid" : "Ed25519 signature invalid"
    };
  } catch (error) {
    return {
      ok: false,
      message: `Ed25519 verification error: ${error.message}`
    };
  }
}
function coerceNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return void 0;
}
function getNested(obj, path) {
  let cur = obj;
  for (const segment of path) {
    if (!isRecord(cur) || !(segment in cur)) return void 0;
    cur = cur[segment];
  }
  return cur;
}
function collectPcr0(tee) {
  const direct = tee.pcr0;
  if (typeof direct === "string" && direct.trim()) return direct;
  const pcrValues = tee.pcrValues;
  if (isRecord(pcrValues)) {
    const pcr0 = pcrValues["0"] ?? pcrValues.PCR0 ?? pcrValues.pcr0;
    if (typeof pcr0 === "string" && pcr0.trim()) return pcr0;
  }
  return void 0;
}
function verifySealOffline(input, options = {}) {
  const now = options.now ?? /* @__PURE__ */ new Date();
  const minConsensusBps = options.minConsensusBps ?? 6700;
  const requiredValidatorCount = options.requiredValidatorCount ?? 1;
  const maxAttestationAgeMs = options.maxAttestationAgeMs ?? 24 * 60 * 60 * 1e3;
  const checks = [];
  const push = (check) => checks.push(check);
  const seal = parseSealInput(input);
  const canonicalJson = canonicalizeSeal(seal);
  const fingerprintSha256 = `0x${(0, import_utils.bytesToHex)((0, import_sha256.sha256)((0, import_utils.utf8ToBytes)(canonicalJson)))}`;
  const requiredFields = [
    "id",
    "jobId",
    "modelHash",
    "inputCommitment",
    "outputCommitment",
    "status",
    "requester",
    "createdAt",
    "validators"
  ];
  for (const field of requiredFields) {
    const present = seal[field] !== void 0 && seal[field] !== null;
    push({
      id: `required:${field}`,
      severity: "error",
      ok: present,
      message: present ? `Required field ${field} present` : `Missing required field ${field}`
    });
  }
  if (options.expectedModelHash) {
    const ok = seal.modelHash === options.expectedModelHash;
    push({
      id: "binding:model-hash",
      severity: "error",
      ok,
      message: ok ? "Model hash matches expected value" : `Model hash mismatch (expected ${options.expectedModelHash})`,
      details: { actual: seal.modelHash, expected: options.expectedModelHash }
    });
  }
  if (options.expectedRequester) {
    const ok = seal.requester === options.expectedRequester;
    push({
      id: "binding:requester",
      severity: "error",
      ok,
      message: ok ? "Requester matches expected value" : `Requester mismatch (expected ${options.expectedRequester})`,
      details: { actual: seal.requester, expected: options.expectedRequester }
    });
  }
  const createdAt = normalizeDate(seal.createdAt);
  push({
    id: "timestamp:createdAt",
    severity: "error",
    ok: Boolean(createdAt),
    message: createdAt ? "createdAt is a valid timestamp" : "createdAt is not a valid timestamp",
    details: createdAt ? { createdAt } : { raw: seal.createdAt }
  });
  const expiresAt = normalizeDate(seal.expiresAt);
  if (seal.expiresAt !== void 0) {
    const ok = Boolean(expiresAt);
    push({
      id: "timestamp:expiresAt",
      severity: "error",
      ok,
      message: ok ? "expiresAt is a valid timestamp" : "expiresAt is not a valid timestamp"
    });
  }
  if (expiresAt) {
    const expired = new Date(expiresAt).getTime() <= now.getTime();
    push({
      id: "lifecycle:expiry",
      severity: expired ? "warning" : "info",
      ok: !expired,
      message: expired ? "Seal is expired" : "Seal has not expired",
      details: { expiresAt, now: now.toISOString() }
    });
  }
  const status = typeof seal.status === "string" ? seal.status : "";
  if (status) {
    const normalizedStatus = status.toLowerCase();
    const revokedAt = normalizeDate(seal.revokedAt);
    const isRevoked = normalizedStatus.includes("revoked");
    push({
      id: "status:revocation-consistency",
      severity: isRevoked ? "warning" : "info",
      ok: !isRevoked || Boolean(revokedAt || seal.revocationReason),
      message: !isRevoked || revokedAt || seal.revocationReason ? "Revocation metadata is consistent with status" : "Revoked seal is missing revokedAt/revocationReason metadata",
      details: { status, revokedAt, revocationReason: seal.revocationReason }
    });
  }
  const validatorsRaw = Array.isArray(seal.validators) ? seal.validators : [];
  push({
    id: "validators:present",
    severity: "error",
    ok: validatorsRaw.length >= requiredValidatorCount,
    message: validatorsRaw.length >= requiredValidatorCount ? `Validator attestations present (${validatorsRaw.length})` : `Insufficient validator attestations (${validatorsRaw.length} < ${requiredValidatorCount})`,
    details: { validatorCount: validatorsRaw.length, requiredValidatorCount }
  });
  let attestedVotingPower;
  let totalVotingPower;
  let consensusBps;
  if (validatorsRaw.length > 0) {
    let allValidatorShapeOk = true;
    let signaturesPresent = 0;
    let powerSum = 0;
    for (const validator of validatorsRaw) {
      if (!isRecord(validator)) {
        allValidatorShapeOk = false;
        continue;
      }
      if (typeof validator.signature === "string" && validator.signature.trim() !== "") {
        signaturesPresent += 1;
      }
      const power = coerceNumber(validator.votingPower);
      if (power !== void 0) powerSum += power;
    }
    attestedVotingPower = powerSum > 0 ? powerSum : void 0;
    push({
      id: "validators:shape",
      severity: "error",
      ok: allValidatorShapeOk,
      message: allValidatorShapeOk ? "Validator attestation records are structurally valid" : "One or more validator attestations are malformed"
    });
    push({
      id: "validators:signatures",
      severity: signaturesPresent === validatorsRaw.length ? "info" : "warning",
      ok: signaturesPresent === validatorsRaw.length,
      message: signaturesPresent === validatorsRaw.length ? "All validator attestations include signatures" : `${signaturesPresent}/${validatorsRaw.length} validator attestations include signatures`
    });
  }
  totalVotingPower = coerceNumber(getNested(seal, ["consensus", "totalVotingPower"])) ?? coerceNumber(getNested(seal, ["consensus", "total_voting_power"])) ?? coerceNumber(seal.totalVotingPower);
  const attestedOverride = coerceNumber(getNested(seal, ["consensus", "attestedVotingPower"])) ?? coerceNumber(getNested(seal, ["consensus", "attested_voting_power"]));
  if (attestedOverride !== void 0) {
    attestedVotingPower = attestedOverride;
  }
  const thresholdOverride = coerceNumber(getNested(seal, ["consensus", "thresholdBps"])) ?? coerceNumber(getNested(seal, ["consensus", "threshold_bps"])) ?? coerceNumber(seal.consensusThresholdBps);
  if (thresholdOverride !== void 0) {
    consensusBps = thresholdOverride;
  } else if (attestedVotingPower !== void 0 && totalVotingPower !== void 0 && totalVotingPower > 0) {
    consensusBps = Math.floor(attestedVotingPower * 1e4 / totalVotingPower);
  }
  if (attestedVotingPower !== void 0 && totalVotingPower !== void 0 && totalVotingPower > 0) {
    const ok = attestedVotingPower * 1e4 >= totalVotingPower * minConsensusBps;
    push({
      id: "consensus:threshold",
      severity: "error",
      ok,
      message: ok ? `Consensus threshold met (${(attestedVotingPower / totalVotingPower * 100).toFixed(2)}%)` : `Consensus threshold not met (${(attestedVotingPower / totalVotingPower * 100).toFixed(2)}% < ${(minConsensusBps / 100).toFixed(2)}%)`,
      details: {
        attestedVotingPower,
        totalVotingPower,
        minConsensusBps
      }
    });
  } else {
    push({
      id: "consensus:threshold",
      severity: "warning",
      ok: false,
      message: "Total voting power unavailable; consensus threshold could not be verified offline",
      details: { attestedVotingPower, totalVotingPower, minConsensusBps }
    });
  }
  if (isRecord(seal.teeAttestation)) {
    const tee = seal.teeAttestation;
    const attestationTs = normalizeDate(tee.timestamp);
    push({
      id: "tee:timestamp",
      severity: "error",
      ok: Boolean(attestationTs),
      message: attestationTs ? "TEE attestation timestamp is valid" : "TEE attestation timestamp is invalid"
    });
    if (attestationTs) {
      const ageMs = Math.max(0, now.getTime() - new Date(attestationTs).getTime());
      push({
        id: "tee:freshness",
        severity: ageMs > maxAttestationAgeMs ? "warning" : "info",
        ok: ageMs <= maxAttestationAgeMs,
        message: ageMs <= maxAttestationAgeMs ? "TEE attestation is within freshness window" : `TEE attestation is stale (${Math.round(ageMs / 1e3)}s old)`,
        details: { ageMs, maxAttestationAgeMs }
      });
    }
    const enclaveHash = typeof tee.enclaveHash === "string" ? tee.enclaveHash : void 0;
    if (options.trustedEnclaveHashes?.length) {
      const ok = Boolean(enclaveHash && options.trustedEnclaveHashes.includes(enclaveHash));
      push({
        id: "tee:trusted-enclave",
        severity: "error",
        ok,
        message: ok ? "TEE enclave hash matches trusted allowlist" : "TEE enclave hash is not in trusted allowlist",
        details: { enclaveHash, trustedEnclaveHashes: options.trustedEnclaveHashes }
      });
    }
    const pcr0 = collectPcr0(tee);
    if (options.trustedPcr0Values?.length) {
      const ok = Boolean(pcr0 && options.trustedPcr0Values.includes(pcr0));
      push({
        id: "tee:trusted-pcr0",
        severity: "error",
        ok,
        message: ok ? "TEE PCR0 matches trusted allowlist" : "TEE PCR0 is not trusted",
        details: { pcr0, trustedPcr0Values: options.trustedPcr0Values }
      });
    }
    if (options.requireTeeNonce) {
      const nonce = typeof tee.nonce === "string" ? tee.nonce : void 0;
      push({
        id: "tee:nonce",
        severity: "error",
        ok: Boolean(nonce),
        message: nonce ? "TEE attestation nonce present" : "TEE attestation nonce missing"
      });
    }
  } else {
    push({
      id: "tee:presence",
      severity: "warning",
      ok: false,
      message: "TEE attestation missing from seal payload"
    });
  }
  const signatures = Array.isArray(seal.signatures) ? seal.signatures : [];
  if (signatures.length > 0) {
    let anyValid = false;
    for (let idx = 0; idx < signatures.length; idx += 1) {
      const sig = signatures[idx];
      if (!isRecord(sig)) {
        push({
          id: `signature:${idx}`,
          severity: "warning",
          ok: false,
          message: "Signature entry is malformed"
        });
        continue;
      }
      const algorithm = typeof sig.algorithm === "string" ? sig.algorithm.toLowerCase() : "ed25519";
      if (algorithm !== "ed25519") {
        push({
          id: `signature:${idx}`,
          severity: "warning",
          ok: false,
          message: `Unsupported signature algorithm: ${sig.algorithm}`
        });
        continue;
      }
      const verification = verifyEd25519Signature(sig, fingerprintSha256, canonicalJson);
      if (verification.ok) anyValid = true;
      push({
        id: `signature:${idx}`,
        severity: verification.ok ? "info" : "warning",
        ok: verification.ok,
        message: verification.message
      });
    }
    push({
      id: "signature:any-valid",
      severity: "warning",
      ok: anyValid,
      message: anyValid ? "At least one offline signature verified" : "No offline signatures verified successfully"
    });
  }
  const errors = checks.filter((c) => c.severity === "error" && !c.ok).map((c) => c.message);
  const warnings = checks.filter((c) => c.severity === "warning" && !c.ok).map((c) => c.message);
  let score = 100;
  for (const check of checks) {
    if (check.ok) continue;
    if (check.severity === "error") score -= 25;
    else if (check.severity === "warning") score -= 8;
    else score -= 2;
  }
  score = Math.max(0, Math.min(100, score));
  return {
    valid: errors.length === 0,
    score,
    fingerprintSha256,
    checks,
    errors,
    warnings,
    normalizedSeal: seal,
    metadata: {
      validatorCount: Array.isArray(seal.validators) ? seal.validators.length : 0,
      attestedVotingPower,
      totalVotingPower,
      consensusBps
    }
  };
}

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

// src/index.ts
var VERSION = "1.0.0";
var AUTHOR = "Aethelred Team";
var LICENSE = "Apache-2.0";
var index_default = {
  VERSION,
  AUTHOR,
  LICENSE
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AUTHOR,
  AethelredClient,
  AethelredError,
  AuthenticationError,
  ConnectionError,
  ErrorCode,
  JobError,
  JobStatus,
  JobsModule,
  LICENSE,
  ModelsModule,
  Network,
  ProofSystem,
  ProofType,
  RateLimitError,
  SealError,
  SealStatus,
  SealsModule,
  TEEPlatform,
  TimeoutError,
  TransactionError,
  UtilityCategory,
  VERSION,
  ValidationError,
  ValidatorsModule,
  VerificationModule,
  canonicalizeSeal,
  fingerprintSealSha256,
  parseSealInput,
  verifySealOffline,
  withAethelredApiRoute,
  withAethelredMiddleware,
  withAethelredNextMiddleware,
  withAethelredRouteHandler
});
