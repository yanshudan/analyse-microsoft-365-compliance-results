import * as core from "@actions/core";
import { AppComplianceAutomationToolForMicrosoft365 } from "@azure/arm-appcomplianceautomation";
import { AzureCliCredential } from "@azure/identity";

async function start() {
  try {
    const cred = new AzureCliCredential();
    const token = await cred.getToken("https://management.azure.com//.default");

    const client = new AppComplianceAutomationToolForMicrosoft365(cred);

    const params = {
      properties: {
        resources: [
          {
            resourceId: "/subscriptions/1a033ab8-736d-473f-9927-65241c799738/resourceGroups/TESTVM/providers/Microsoft.Compute/virtualMachines/smallvm",
            tags: {}
          }
        ],
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

    console.log(`Successfully created report ${reportName}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

start();
