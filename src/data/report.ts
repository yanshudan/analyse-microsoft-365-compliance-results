import { AppComplianceAutomationToolForMicrosoft365 } from "@azure/arm-appcomplianceautomation";
import { AzureCliCredential } from "@azure/identity";
import { getCredToken } from "../utils";

export async function createOrUpdateReport(cred: AzureCliCredential, reportName: string, resourceIds: string[]) {
  const client = new AppComplianceAutomationToolForMicrosoft365(cred);

  const resources = resourceIds.map((resourceId: string) => {
    return { resourceId: resourceId, tags: {} };
  });
  const token = await getCredToken(cred);

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
        "Authorization": token,
        "x-ms-aad-user-token": token,
        "Content-Type": "application/json"
      }
    }
  };

  const req = await client.report.beginCreateOrUpdate(reportName, params, options);
  await req.pollUntilDone();
}
