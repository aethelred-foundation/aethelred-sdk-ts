export { bytesToHex, hexToBytes } from '@noble/hashes/utils';

/**
 * Cryptographic utilities for Aethelred SDK.
 */

declare function sha256(data: Uint8Array | string): Uint8Array;
declare function sha256Hex(data: Uint8Array | string): string;
declare function toHex(bytes: Uint8Array): string;
declare function fromHex(hex: string): Uint8Array;

export { fromHex, sha256, sha256Hex, toHex };
