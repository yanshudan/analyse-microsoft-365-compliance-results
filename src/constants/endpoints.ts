export const RP_NAMESPACE = "Microsoft.AppComplianceAutomation";
const version = "2023-02-15-preview";

export const Endpoints = {
  onboard: `/providers/${RP_NAMESPACE}/onboard?api-version=${version}`,
  triggerEvaluation: `/providers/${RP_NAMESPACE}/triggerEvaluation?api-version=${version}`
};
