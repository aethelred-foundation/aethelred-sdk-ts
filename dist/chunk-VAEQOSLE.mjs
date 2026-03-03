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

export {
  ModelsModule
};
