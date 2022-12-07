"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const arm_appcomplianceautomation_1 = require("@azure/arm-appcomplianceautomation");
const identity_1 = require("@azure/identity");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cred = new identity_1.AzureCliCredential();
            const token = yield cred.getToken("https://management.azure.com//.default");
            const client = new arm_appcomplianceautomation_1.AppComplianceAutomationToolForMicrosoft365(cred);
            const resources = JSON.parse(core.getInput('resource-list')).map((resourceId) => {
                return { resourceId: resourceId, tags: {} };
            });
            const params = {
                properties: {
                    resources,
                    timeZone: "China Standard Time",
                    triggerTime: new Date("2022-12-05T18:00:00.000Z")
                }
            };
            const options = {
                requestOptions: {
                    customHeaders: {
                        "Authorization": `Bearer ${token.token}`,
                        "x-ms-aad-user-token": `Bearer ${token.token}`,
                        "Content-Type": "application/json"
                    }
                }
            };
            const reportName = core.getInput('report-name');
            const req = yield client.report.beginCreateOrUpdate(reportName, params, options);
            yield req.pollUntilDone();
            core.info(`Successfully created report ${reportName}`);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
start();
