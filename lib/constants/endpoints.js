"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoints = exports.RP_NAMESPACE = void 0;
exports.RP_NAMESPACE = "Microsoft.AppComplianceAutomation";
const version = "2023-02-15-preview";
exports.Endpoints = {
    onboard: `/providers/${exports.RP_NAMESPACE}/onboard?api-version=${version}`,
    triggerEvaluation: `/providers/${exports.RP_NAMESPACE}/triggerEvaluation?api-version=${version}`
};
