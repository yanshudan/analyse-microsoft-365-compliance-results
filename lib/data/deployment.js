"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResourceIdsByDeployment = void 0;
const arm_resources_1 = require("@azure/arm-resources");
function getResourceIdsByDeployment(cred, subscriptionId, resourceGroupName, deploymentName) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const depclient = new arm_resources_1.ResourceManagementClient(cred, subscriptionId);
        const deployment = yield depclient.deployments.get(resourceGroupName, deploymentName);
        return (_c = (_b = (_a = deployment.properties) === null || _a === void 0 ? void 0 : _a.outputResources) === null || _b === void 0 ? void 0 : _b.map((resource) => {
            var _a;
            return (_a = resource.id) !== null && _a !== void 0 ? _a : "null";
        })) !== null && _c !== void 0 ? _c : [];
    });
}
exports.getResourceIdsByDeployment = getResourceIdsByDeployment;
