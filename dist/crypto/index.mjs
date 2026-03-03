// src/crypto/index.ts
import { sha256 as nobleSha256 } from "@noble/hashes/sha256";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
function sha256(data) {
  const input = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return nobleSha256(input);
}
function sha256Hex(data) {
  return bytesToHex(sha256(data));
}
function toHex(bytes) {
  return bytesToHex(bytes);
}
function fromHex(hex) {
  return hexToBytes(hex);
}
export {
  bytesToHex,
  fromHex,
  hexToBytes,
  sha256,
  sha256Hex,
  toHex
};
