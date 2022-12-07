import * as core from "@actions/core";
import { AppComplianceAutomationToolForMicrosoft365 } from "@azure/arm-appcomplianceautomation";
import { AzureCliCredential } from "@azure/identity";

async function start() {
  try {
    const cred = new AzureCliCredential();
    const token = await cred.getToken("https://management.azure.com//.default");

    const client = new AppComplianceAutomationToolForMicrosoft365(cred);
    const resources = JSON.parse(core.getInput('resource-list')).map((resourceId: string) => {
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
    const req = await client.report.beginCreateOrUpdate(reportName, params, options);
    await req.pollUntilDone();

    core.info(`Successfully created report ${reportName}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

start();
