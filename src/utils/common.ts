import { AzureCliCredential } from "@azure/identity";
import * as realTimeConfig from "../config/m365_policies_realtime.json";
import { setTimeout } from "timers/promises";

const realTimeIds = realTimeConfig.realtime.map(id => `/providers/microsoft.authorization/policydefinitions/${id.toLowerCase()}`);

export function isRealTimePolicy(policyId: string): boolean {
  return realTimeIds.includes(policyId.toLowerCase());
}

export async function getCredToken(cred: AzureCliCredential): Promise<string> {
  const token = await cred.getToken("https://management.azure.com//.default");
  return `Bearer ${token.token}`;
}

export function getResourceSubscription(resourceId: string): string {
  const subStr = resourceId.split("/");
  return subStr.length >= 3 ? subStr[2] : "";
}

export async function waitOnboardFinish() {
  // TODO: replace with check dependency successfully created
  // wait for 30 seconds temporarily
  await setTimeout(30 * 1000);
}
