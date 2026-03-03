type SealCheckSeverity = "error" | "warning" | "info";
interface SealVerificationCheck {
    id: string;
    severity: SealCheckSeverity;
    ok: boolean;
    message: string;
    details?: Record<string, unknown>;
}
interface SealVerificationOptions {
    now?: Date;
    minConsensusBps?: number;
    requiredValidatorCount?: number;
    maxAttestationAgeMs?: number;
    requireTeeNonce?: boolean;
    trustedEnclaveHashes?: string[];
    trustedPcr0Values?: string[];
    expectedModelHash?: string;
    expectedRequester?: string;
}
interface SealVerificationResult {
    valid: boolean;
    score: number;
    fingerprintSha256: string;
    checks: SealVerificationCheck[];
    errors: string[];
    warnings: string[];
    normalizedSeal: Record<string, unknown>;
    metadata: {
        validatorCount: number;
        attestedVotingPower?: number;
        totalVotingPower?: number;
        consensusBps?: number;
    };
}
interface SealSignatureEnvelope {
    algorithm?: string;
    publicKeyHex?: string;
    publicKeyBase64?: string;
    signatureHex?: string;
    signatureBase64?: string;
    message?: "fingerprint" | "canonical-json";
}
declare function parseSealInput(input: string | Record<string, unknown>): Record<string, unknown>;
declare function canonicalizeSeal(seal: Record<string, unknown>): string;
declare function fingerprintSealSha256(seal: Record<string, unknown>): string;
declare function verifySealOffline(input: string | Record<string, unknown>, options?: SealVerificationOptions): SealVerificationResult;

export { type SealCheckSeverity, type SealSignatureEnvelope, type SealVerificationCheck, type SealVerificationOptions, type SealVerificationResult, canonicalizeSeal, fingerprintSealSha256, parseSealInput, verifySealOffline };
