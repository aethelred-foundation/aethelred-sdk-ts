// src/core/types.ts
var JobStatus = /* @__PURE__ */ ((JobStatus2) => {
  JobStatus2["UNSPECIFIED"] = "JOB_STATUS_UNSPECIFIED";
  JobStatus2["PENDING"] = "JOB_STATUS_PENDING";
  JobStatus2["ASSIGNED"] = "JOB_STATUS_ASSIGNED";
  JobStatus2["COMPUTING"] = "JOB_STATUS_COMPUTING";
  JobStatus2["VERIFYING"] = "JOB_STATUS_VERIFYING";
  JobStatus2["COMPLETED"] = "JOB_STATUS_COMPLETED";
  JobStatus2["FAILED"] = "JOB_STATUS_FAILED";
  JobStatus2["CANCELLED"] = "JOB_STATUS_CANCELLED";
  JobStatus2["EXPIRED"] = "JOB_STATUS_EXPIRED";
  return JobStatus2;
})(JobStatus || {});
var SealStatus = /* @__PURE__ */ ((SealStatus2) => {
  SealStatus2["UNSPECIFIED"] = "SEAL_STATUS_UNSPECIFIED";
  SealStatus2["ACTIVE"] = "SEAL_STATUS_ACTIVE";
  SealStatus2["REVOKED"] = "SEAL_STATUS_REVOKED";
  SealStatus2["EXPIRED"] = "SEAL_STATUS_EXPIRED";
  SealStatus2["SUPERSEDED"] = "SEAL_STATUS_SUPERSEDED";
  return SealStatus2;
})(SealStatus || {});
var ProofType = /* @__PURE__ */ ((ProofType2) => {
  ProofType2["UNSPECIFIED"] = "PROOF_TYPE_UNSPECIFIED";
  ProofType2["TEE"] = "PROOF_TYPE_TEE";
  ProofType2["ZKML"] = "PROOF_TYPE_ZKML";
  ProofType2["HYBRID"] = "PROOF_TYPE_HYBRID";
  ProofType2["OPTIMISTIC"] = "PROOF_TYPE_OPTIMISTIC";
  return ProofType2;
})(ProofType || {});
var ProofSystem = /* @__PURE__ */ ((ProofSystem2) => {
  ProofSystem2["UNSPECIFIED"] = "PROOF_SYSTEM_UNSPECIFIED";
  ProofSystem2["GROTH16"] = "PROOF_SYSTEM_GROTH16";
  ProofSystem2["PLONK"] = "PROOF_SYSTEM_PLONK";
  ProofSystem2["STARK"] = "PROOF_SYSTEM_STARK";
  ProofSystem2["EZKL"] = "PROOF_SYSTEM_EZKL";
  return ProofSystem2;
})(ProofSystem || {});
var TEEPlatform = /* @__PURE__ */ ((TEEPlatform2) => {
  TEEPlatform2["UNSPECIFIED"] = "TEE_PLATFORM_UNSPECIFIED";
  TEEPlatform2["INTEL_SGX"] = "TEE_PLATFORM_INTEL_SGX";
  TEEPlatform2["AMD_SEV"] = "TEE_PLATFORM_AMD_SEV";
  TEEPlatform2["AWS_NITRO"] = "TEE_PLATFORM_AWS_NITRO";
  TEEPlatform2["ARM_TRUSTZONE"] = "TEE_PLATFORM_ARM_TRUSTZONE";
  return TEEPlatform2;
})(TEEPlatform || {});
var UtilityCategory = /* @__PURE__ */ ((UtilityCategory2) => {
  UtilityCategory2["UNSPECIFIED"] = "UTILITY_CATEGORY_UNSPECIFIED";
  UtilityCategory2["MEDICAL"] = "UTILITY_CATEGORY_MEDICAL";
  UtilityCategory2["SCIENTIFIC"] = "UTILITY_CATEGORY_SCIENTIFIC";
  UtilityCategory2["FINANCIAL"] = "UTILITY_CATEGORY_FINANCIAL";
  UtilityCategory2["LEGAL"] = "UTILITY_CATEGORY_LEGAL";
  UtilityCategory2["EDUCATIONAL"] = "UTILITY_CATEGORY_EDUCATIONAL";
  UtilityCategory2["ENVIRONMENTAL"] = "UTILITY_CATEGORY_ENVIRONMENTAL";
  UtilityCategory2["GENERAL"] = "UTILITY_CATEGORY_GENERAL";
  return UtilityCategory2;
})(UtilityCategory || {});

export {
  JobStatus,
  SealStatus,
  ProofType,
  ProofSystem,
  TEEPlatform,
  UtilityCategory
};
