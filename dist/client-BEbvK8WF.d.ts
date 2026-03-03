/**
 * Configuration for Aethelred SDK.
 */
declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    DEVNET = "devnet",
    LOCAL = "local"
}
interface NetworkConfig {
    rpcUrl: string;
    chainId: string;
    wsUrl?: string;
    grpcUrl?: string;
    restUrl?: string;
    explorerUrl?: string;
}
interface RetryConfig {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    exponentialBase: number;
}
interface TimeoutConfig {
    connect: number;
    read: number;
    write: number;
}
interface Config {
    network?: Network;
    rpcUrl?: string;
    chainId?: string;
    apiKey?: string;
    privateKey?: string;
    timeout?: Partial<TimeoutConfig>;
    retry?: Partial<RetryConfig>;
    maxConnections?: number;
    wsEnabled?: boolean;
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    logRequests?: boolean;
}

/**
 * Core types for Aethelred SDK.
 */
type Address = string;
type Hash = string;
type TxHash = string;
declare enum JobStatus {
    UNSPECIFIED = "JOB_STATUS_UNSPECIFIED",
    PENDING = "JOB_STATUS_PENDING",
    ASSIGNED = "JOB_STATUS_ASSIGNED",
    COMPUTING = "JOB_STATUS_COMPUTING",
    VERIFYING = "JOB_STATUS_VERIFYING",
    COMPLETED = "JOB_STATUS_COMPLETED",
    FAILED = "JOB_STATUS_FAILED",
    CANCELLED = "JOB_STATUS_CANCELLED",
    EXPIRED = "JOB_STATUS_EXPIRED"
}
declare enum SealStatus {
    UNSPECIFIED = "SEAL_STATUS_UNSPECIFIED",
    ACTIVE = "SEAL_STATUS_ACTIVE",
    REVOKED = "SEAL_STATUS_REVOKED",
    EXPIRED = "SEAL_STATUS_EXPIRED",
    SUPERSEDED = "SEAL_STATUS_SUPERSEDED"
}
declare enum ProofType {
    UNSPECIFIED = "PROOF_TYPE_UNSPECIFIED",
    TEE = "PROOF_TYPE_TEE",
    ZKML = "PROOF_TYPE_ZKML",
    HYBRID = "PROOF_TYPE_HYBRID",
    OPTIMISTIC = "PROOF_TYPE_OPTIMISTIC"
}
declare enum ProofSystem {
    UNSPECIFIED = "PROOF_SYSTEM_UNSPECIFIED",
    GROTH16 = "PROOF_SYSTEM_GROTH16",
    PLONK = "PROOF_SYSTEM_PLONK",
    STARK = "PROOF_SYSTEM_STARK",
    EZKL = "PROOF_SYSTEM_EZKL"
}
declare enum TEEPlatform {
    UNSPECIFIED = "TEE_PLATFORM_UNSPECIFIED",
    INTEL_SGX = "TEE_PLATFORM_INTEL_SGX",
    AMD_SEV = "TEE_PLATFORM_AMD_SEV",
    AWS_NITRO = "TEE_PLATFORM_AWS_NITRO",
    ARM_TRUSTZONE = "TEE_PLATFORM_ARM_TRUSTZONE"
}
declare enum UtilityCategory {
    UNSPECIFIED = "UTILITY_CATEGORY_UNSPECIFIED",
    MEDICAL = "UTILITY_CATEGORY_MEDICAL",
    SCIENTIFIC = "UTILITY_CATEGORY_SCIENTIFIC",
    FINANCIAL = "UTILITY_CATEGORY_FINANCIAL",
    LEGAL = "UTILITY_CATEGORY_LEGAL",
    EDUCATIONAL = "UTILITY_CATEGORY_EDUCATIONAL",
    ENVIRONMENTAL = "UTILITY_CATEGORY_ENVIRONMENTAL",
    GENERAL = "UTILITY_CATEGORY_GENERAL"
}
interface PageRequest {
    key?: string;
    offset?: number;
    limit?: number;
    countTotal?: boolean;
    reverse?: boolean;
}
interface PageResponse {
    nextKey?: string;
    total: number;
}
interface ComputeJob {
    id: string;
    creator: Address;
    modelHash: Hash;
    inputHash: Hash;
    outputHash?: Hash;
    status: JobStatus;
    proofType: ProofType;
    priority: number;
    maxGas: string;
    timeoutBlocks: number;
    createdAt: Date;
    completedAt?: Date;
    validatorAddress?: Address;
    metadata: Record<string, string>;
}
interface SubmitJobRequest {
    modelHash: Hash;
    inputHash: Hash;
    proofType?: ProofType;
    priority?: number;
    maxGas?: string;
    timeoutBlocks?: number;
    callbackUrl?: string;
    metadata?: Record<string, string>;
}
interface SubmitJobResponse {
    jobId: string;
    txHash: TxHash;
    estimatedBlocks: number;
}
interface RegulatoryInfo {
    jurisdiction: string;
    complianceFrameworks: string[];
    dataClassification: string;
    retentionPeriod: string;
    auditTrailHash?: Hash;
}
interface ValidatorAttestation {
    validatorAddress: Address;
    signature: string;
    timestamp: Date;
    votingPower: string;
}
interface TEEAttestation {
    platform: TEEPlatform;
    quote: string;
    enclaveHash: Hash;
    timestamp: Date;
    pcrValues: Record<string, string>;
    nonce?: string;
}
interface ZKMLProof {
    proofSystem: ProofSystem;
    proof: string;
    publicInputs: string[];
    verifyingKeyHash: Hash;
}
interface DigitalSeal {
    id: string;
    jobId: string;
    modelHash: Hash;
    inputCommitment: Hash;
    outputCommitment: Hash;
    modelCommitment: Hash;
    status: SealStatus;
    requester: Address;
    validators: ValidatorAttestation[];
    teeAttestation?: TEEAttestation;
    zkmlProof?: ZKMLProof;
    regulatoryInfo?: RegulatoryInfo;
    createdAt: Date;
    expiresAt?: Date;
    revokedAt?: Date;
    revocationReason?: string;
}
interface CreateSealRequest {
    jobId: string;
    regulatoryInfo?: RegulatoryInfo;
    expiresInBlocks?: number;
    metadata?: Record<string, string>;
}
interface CreateSealResponse {
    sealId: string;
    txHash: TxHash;
}
interface VerifySealResponse {
    valid: boolean;
    seal?: DigitalSeal;
    verificationDetails: Record<string, boolean>;
    errors: string[];
}
interface RegisteredModel {
    modelHash: Hash;
    name: string;
    owner: Address;
    architecture: string;
    version: string;
    category: UtilityCategory;
    inputSchema: string;
    outputSchema: string;
    storageUri: string;
    registeredAt: Date;
    verified: boolean;
    totalJobs: number;
}
interface HardwareCapability {
    teePlatforms: TEEPlatform[];
    zkmlSupported: boolean;
    maxModelSizeMb: number;
    gpuMemoryGb: number;
    cpuCores: number;
    memoryGb: number;
}
interface ValidatorStats {
    address: Address;
    jobsCompleted: number;
    jobsFailed: number;
    averageLatencyMs: number;
    uptimePercentage: number;
    reputationScore: number;
    totalRewards: string;
    slashingEvents: number;
    hardwareCapabilities?: HardwareCapability;
}
interface NodeInfo {
    defaultNodeId: string;
    listenAddr: string;
    network: string;
    version: string;
    moniker: string;
}
interface Block {
    blockId: {
        hash: string;
    };
    header: {
        height: number;
        time: Date;
        chainId: string;
    };
}

/**
 * Jobs module for Aethelred SDK.
 */

declare class JobsModule {
    private readonly client;
    private readonly basePath;
    constructor(client: AethelredClient);
    submit(request: SubmitJobRequest): Promise<SubmitJobResponse>;
    get(jobId: string): Promise<ComputeJob>;
    list(options?: {
        status?: JobStatus;
        creator?: string;
        pagination?: PageRequest;
    }): Promise<ComputeJob[]>;
    listPending(pagination?: PageRequest): Promise<ComputeJob[]>;
    cancel(jobId: string): Promise<boolean>;
    waitForCompletion(jobId: string, options?: {
        pollInterval?: number;
        timeout?: number;
    }): Promise<ComputeJob>;
}

/**
 * Seals module for Aethelred SDK.
 */

declare class SealsModule {
    private readonly client;
    private readonly basePath;
    constructor(client: AethelredClient);
    create(request: CreateSealRequest): Promise<CreateSealResponse>;
    get(sealId: string): Promise<DigitalSeal>;
    list(options?: {
        requester?: string;
        modelHash?: string;
        status?: SealStatus;
        pagination?: PageRequest;
    }): Promise<DigitalSeal[]>;
    listByModel(modelHash: string, pagination?: PageRequest): Promise<DigitalSeal[]>;
    verify(sealId: string): Promise<VerifySealResponse>;
    revoke(sealId: string, reason: string): Promise<boolean>;
    export(sealId: string, format?: 'json' | 'cbor' | 'protobuf'): Promise<string>;
}

/**
 * Models module for Aethelred SDK.
 */

interface RegisterModelRequest {
    modelHash: string;
    name: string;
    architecture?: string;
    version?: string;
    category?: UtilityCategory;
    inputSchema?: string;
    outputSchema?: string;
    storageUri?: string;
    metadata?: Record<string, string>;
}
interface RegisterModelResponse {
    modelHash: string;
    txHash: string;
}
declare class ModelsModule {
    private readonly client;
    private readonly basePath;
    constructor(client: AethelredClient);
    register(request: RegisterModelRequest): Promise<RegisterModelResponse>;
    get(modelHash: string): Promise<RegisteredModel>;
    list(options?: {
        owner?: string;
        category?: UtilityCategory;
        pagination?: PageRequest;
    }): Promise<RegisteredModel[]>;
}

/**
 * Validators module for Aethelred SDK.
 */

declare class ValidatorsModule {
    private readonly client;
    private readonly basePath;
    constructor(client: AethelredClient);
    getStats(address: string): Promise<ValidatorStats>;
    list(pagination?: PageRequest): Promise<ValidatorStats[]>;
    registerCapability(address: string, capability: HardwareCapability): Promise<boolean>;
}

/**
 * Verification module for Aethelred SDK.
 */

interface VerifyZKProofRequest {
    proof: string;
    publicInputs: string[];
    verifyingKeyHash: string;
    proofSystem?: ProofSystem;
}
interface VerifyZKProofResponse {
    valid: boolean;
    verificationTimeMs: number;
    error?: string;
}
interface VerifyTEEResponse {
    valid: boolean;
    platform: TEEPlatform;
    enclaveHash?: string;
    timestamp?: Date;
    error?: string;
}
declare class VerificationModule {
    private readonly client;
    private readonly basePath;
    constructor(client: AethelredClient);
    verifyZKProof(request: VerifyZKProofRequest): Promise<VerifyZKProofResponse>;
    verifyTEEAttestation(attestation: TEEAttestation, expectedEnclaveHash?: string): Promise<VerifyTEEResponse>;
}

/**
 * Main client for Aethelred SDK.
 */

declare class AethelredClient {
    private readonly config;
    private readonly http;
    readonly jobs: JobsModule;
    readonly seals: SealsModule;
    readonly models: ModelsModule;
    readonly validators: ValidatorsModule;
    readonly verification: VerificationModule;
    constructor(config?: Config | string);
    private setupInterceptors;
    get<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T>;
    post<T = unknown>(path: string, data?: unknown): Promise<T>;
    put<T = unknown>(path: string, data?: unknown): Promise<T>;
    delete<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T>;
    getNodeInfo(): Promise<NodeInfo>;
    getLatestBlock(): Promise<Block>;
    getBlock(height: number): Promise<Block>;
    healthCheck(): Promise<boolean>;
    getNetworkConfig(): NetworkConfig;
    getRpcUrl(): string;
    getChainId(): string;
}

export { AethelredClient as A, type Block as B, type ComputeJob as C, type DigitalSeal as D, type HardwareCapability as H, JobStatus as J, ModelsModule as M, Network as N, type PageRequest as P, type RegisteredModel as R, SealStatus as S, type TEEAttestation as T, UtilityCategory as U, type VerifySealResponse as V, type ZKMLProof as Z, type Address as a, type Config as b, type CreateSealRequest as c, type CreateSealResponse as d, type Hash as e, JobsModule as f, type NetworkConfig as g, type NodeInfo as h, type PageResponse as i, ProofSystem as j, ProofType as k, type RegulatoryInfo as l, SealsModule as m, type SubmitJobRequest as n, type SubmitJobResponse as o, TEEPlatform as p, type TxHash as q, type ValidatorAttestation as r, type ValidatorStats as s, ValidatorsModule as t, VerificationModule as u, type RegisterModelRequest as v, type RegisterModelResponse as w };
