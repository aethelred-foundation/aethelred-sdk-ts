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

export {
  SealsModule
};
