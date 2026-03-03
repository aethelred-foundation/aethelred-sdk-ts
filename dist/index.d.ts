export { a as Address, A as AethelredClient, B as Block, C as ComputeJob, b as Config, c as CreateSealRequest, d as CreateSealResponse, D as DigitalSeal, H as HardwareCapability, e as Hash, J as JobStatus, f as JobsModule, M as ModelsModule, N as Network, g as NetworkConfig, h as NodeInfo, P as PageRequest, i as PageResponse, j as ProofSystem, k as ProofType, R as RegisteredModel, l as RegulatoryInfo, S as SealStatus, m as SealsModule, n as SubmitJobRequest, o as SubmitJobResponse, T as TEEAttestation, p as TEEPlatform, q as TxHash, U as UtilityCategory, r as ValidatorAttestation, s as ValidatorStats, t as ValidatorsModule, u as VerificationModule, V as VerifySealResponse, Z as ZKMLProof } from './client-BEbvK8WF.js';
export { canonicalizeSeal, fingerprintSealSha256, parseSealInput, verifySealOffline } from './devtools/index.js';
export { w as withAethelredApiRoute, a as withAethelredMiddleware, a as withAethelredNextMiddleware, b as withAethelredRouteHandler } from './index-BOANs8Cr.js';

/**
 * Error types for Aethelred SDK.
 */
declare enum ErrorCode {
    UNKNOWN = 1000,
    INTERNAL = 1001,
    INVALID_ARGUMENT = 1002,
    NOT_FOUND = 1003,
    ALREADY_EXISTS = 1004,
    PERMISSION_DENIED = 1005,
    CONNECTION_FAILED = 1100,
    CONNECTION_TIMEOUT = 1101,
    AUTHENTICATION_REQUIRED = 1200,
    INVALID_API_KEY = 1201,
    RATE_LIMITED = 1300,
    TRANSACTION_FAILED = 1400,
    INSUFFICIENT_FUNDS = 1401,
    JOB_NOT_FOUND = 1500,
    JOB_FAILED = 1504,
    SEAL_NOT_FOUND = 1600,
    SEAL_VERIFICATION_FAILED = 1604,
    MODEL_NOT_FOUND = 1700,
    VERIFICATION_FAILED = 1800,
    VALIDATION_FAILED = 1900
}
declare class AethelredError extends Error {
    readonly code: ErrorCode;
    readonly details: Record<string, unknown>;
    readonly cause?: Error;
    constructor(message: string, code?: ErrorCode, details?: Record<string, unknown>, cause?: Error);
    toJSON(): Record<string, unknown>;
}
declare class ConnectionError extends AethelredError {
    constructor(message?: string, cause?: Error);
}
declare class AuthenticationError extends AethelredError {
    constructor(message?: string);
}
declare class RateLimitError extends AethelredError {
    readonly retryAfter?: number;
    constructor(message?: string, retryAfter?: number);
}
declare class TransactionError extends AethelredError {
    readonly txHash?: string;
    constructor(message?: string, txHash?: string, code?: ErrorCode);
}
declare class JobError extends AethelredError {
    readonly jobId?: string;
    constructor(message?: string, jobId?: string, code?: ErrorCode);
}
declare class SealError extends AethelredError {
    readonly sealId?: string;
    constructor(message?: string, sealId?: string, code?: ErrorCode);
}
declare class ValidationError extends AethelredError {
    readonly field?: string;
    constructor(message?: string, field?: string);
}
declare class TimeoutError extends AethelredError {
    constructor(message?: string, timeoutMs?: number);
}

/**
 * Official Aethelred TypeScript/JavaScript SDK
 *
 * Stable public entrypoint for Node.js and browser clients.
 * Advanced experimental tensor/runtime internals remain in source but are not
 * exported from the root package until their type surfaces are fully stabilized.
 */
declare const VERSION = "1.0.0";
declare const AUTHOR = "Aethelred Team";
declare const LICENSE = "Apache-2.0";

declare const _default: {
    VERSION: string;
    AUTHOR: string;
    LICENSE: string;
};

export { AUTHOR, AethelredError, AuthenticationError, ConnectionError, ErrorCode, JobError, LICENSE, RateLimitError, SealError, TimeoutError, TransactionError, VERSION, ValidationError, _default as default };
