import * as core from "@actions/core";
import { AzureCliCredential } from "@azure/identity";
import { getResourceIdsByDeployment } from "./data/deployment";
import { getPolicyStates } from "./data/policyStates";
import { createOrUpdateReport } from "./data/report";

async function start() {
  try {
    const cred = new AzureCliCredential();

    const deploymentName = core.getInput('deployment-name');
    const resourceGroupName = core.getInput('resource-group');
    const subscriptionId = core.getInput('subscription-id');
    const reportName = core.getInput('report-name');

    const resourceIds = await getResourceIdsByDeployment(cred, subscriptionId, resourceGroupName, deploymentName);

    await createOrUpdateReport(cred, reportName, resourceIds);
    core.info(`Successfully created or updated report ${reportName}`);

    core.info("Evaluating policy states for all subscriptions...");
    await getPolicyStates(cred, resourceIds);

  } catch (error) {
    core.setFailed(error.message);
  }
}

start();
