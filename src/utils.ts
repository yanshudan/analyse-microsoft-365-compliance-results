import { AzureCliCredential } from "@azure/identity";
import * as realTimeConfig from "./config/m365_policies_realtime.json";

const realTimeIds = realTimeConfig.realtime.map(id => `/providers/microsoft.authorization/policydefinitions/${id.toLowerCase()}`);

export function isRealTimePolicy(policyId: string): boolean {
  return realTimeIds.includes(policyId.toLowerCase());
}

export async function getCredToken(cred: AzureCliCredential): Promise<string> {
  const token = await cred.getToken("https://management.azure.com//.default");
  return `Bearer ${token.token}`;
}
