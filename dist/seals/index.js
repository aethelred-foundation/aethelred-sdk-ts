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

// src/seals/index.ts
var seals_exports = {};
__export(seals_exports, {
  SealsModule: () => SealsModule
});
module.exports = __toCommonJS(seals_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SealsModule
});
