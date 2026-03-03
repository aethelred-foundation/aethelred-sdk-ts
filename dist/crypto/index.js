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

// src/crypto/index.ts
var crypto_exports = {};
__export(crypto_exports, {
  bytesToHex: () => import_utils.bytesToHex,
  fromHex: () => fromHex,
  hexToBytes: () => import_utils.hexToBytes,
  sha256: () => sha256,
  sha256Hex: () => sha256Hex,
  toHex: () => toHex
});
module.exports = __toCommonJS(crypto_exports);
var import_sha256 = require("@noble/hashes/sha256");
var import_utils = require("@noble/hashes/utils");
function sha256(data) {
  const input = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return (0, import_sha256.sha256)(input);
}
function sha256Hex(data) {
  return (0, import_utils.bytesToHex)(sha256(data));
}
function toHex(bytes) {
  return (0, import_utils.bytesToHex)(bytes);
}
function fromHex(hex) {
  return (0, import_utils.hexToBytes)(hex);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bytesToHex,
  fromHex,
  hexToBytes,
  sha256,
  sha256Hex,
  toHex
});
