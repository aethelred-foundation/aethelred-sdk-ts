import {
  SealsModule
} from "./chunk-DCONG3Q6.mjs";
import {
  canonicalizeSeal,
  fingerprintSealSha256,
  parseSealInput,
  verifySealOffline
} from "./chunk-KRINAM3O.mjs";
import {
  withAethelredApiRoute,
  withAethelredRouteHandler
} from "./chunk-LNGAH2UF.mjs";
import {
  withAethelredMiddleware
} from "./chunk-DOGGMIGE.mjs";
import {
  AethelredError,
  AuthenticationError,
  ConnectionError,
  ErrorCode,
  JobError,
  JobsModule,
  RateLimitError,
  SealError,
  TimeoutError,
  TransactionError,
  ValidationError
} from "./chunk-V22XEMYR.mjs";
import {
  ModelsModule
} from "./chunk-VAEQOSLE.mjs";
import {
  JobStatus,
  ProofSystem,
  ProofType,
  SealStatus,
  TEEPlatform,
  UtilityCategory
} from "./chunk-74DCVGBD.mjs";

// src/core/client.ts
import axios from "axios";

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
    this.http = axios.create({
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

// src/index.ts
var VERSION = "1.0.0";
var AUTHOR = "Aethelred Team";
var LICENSE = "Apache-2.0";
var index_default = {
  VERSION,
  AUTHOR,
  LICENSE
};
export {
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
  index_default as default,
  fingerprintSealSha256,
  parseSealInput,
  verifySealOffline,
  withAethelredApiRoute,
  withAethelredMiddleware,
  withAethelredMiddleware as withAethelredNextMiddleware,
  withAethelredRouteHandler
};
