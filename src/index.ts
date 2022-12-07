import * as core from "@actions/core";
import { AppComplianceAutomationToolForMicrosoft365 } from "@azure/arm-appcomplianceautomation";
import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { AzureCliCredential } from "@azure/identity";

async function start() {
  try {
    const cred = new AzureCliCredential();

    const reportName = core.getInput('report-name');
    const resourceIds = JSON.parse(core.getInput('resource-list'));

    await createOrUpdateReport(cred, reportName, resourceIds);
    await getPolicyStates(cred, resourceIds);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function createOrUpdateReport(cred: AzureCliCredential, reportName: string, resourceIds: string[]) {
  const client = new AppComplianceAutomationToolForMicrosoft365(cred);

  const resources = resourceIds.map((resourceId: string) => {
    return { resourceId: resourceId, tags: {} };
  });
  const token = await cred.getToken("https://management.azure.com//.default");

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

  const req = await client.report.beginCreateOrUpdate(reportName, params, options);
  await req.pollUntilDone();

  core.info(`Successfully created or updated report ${reportName}`);
}

async function getPolicyStates(cred: AzureCliCredential, resourceIds: string[]) {
  const subscriptionSet = new Set<string>();

  for (const id of resourceIds) {
    const strs = id.split("/");
    if (strs.length < 3) {
      continue;
    }
    subscriptionSet.add(strs[2]);
  }

  const clients: PolicyInsightsClient[] = Array.from(subscriptionSet).map(id => new PolicyInsightsClient(cred, id));
  const triggerPromises: Promise<void>[] = [];

  for (const client of clients) {
    const promise = client.policyStates.beginTriggerSubscriptionEvaluationAndWait(client.subscriptionId);
    triggerPromises.push(promise);
  }

  core.info("Evaluating policy states for all subscriptions...")
  await Promise.all(triggerPromises);

  core.info("Generating results...");
  const lowerCaseResourceIds = resourceIds.map(id => id.toLocaleLowerCase());
  for (const client of clients) {
    const iter = client.policyStates.listQueryResultsForSubscription("default", client.subscriptionId);

    for await (let policyState of iter) {
      const resourceId = policyState.resourceId ?? "";
      if (lowerCaseResourceIds.includes(resourceId.toLocaleLowerCase())) {
        core.info(`Resource Id: ${resourceId}\tDefinition Id: ${policyState.policyDefinitionId}\tIs Compliant: ${policyState.isCompliant}`);
      }
    }
  }
}

start();
