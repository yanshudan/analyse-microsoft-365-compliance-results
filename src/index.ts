import * as core from "@actions/core";
import { AzureCliCredential } from "@azure/identity";
import { getResourceIdsByDeployment } from "./data/deployment";
import { onboard } from "./data/onboard";
import { getPolicyStates } from "./data/policyStates";
import { createOrUpdateReport } from "./data/report";
import { getCredToken, getResourceSubscription, waitOnboardFinish } from "./utils/common";

async function start() {
  try {
    const cred = new AzureCliCredential();
    const token = await getCredToken(cred);

    const deploymentName = core.getInput('deployment-name');
    const resourceGroupName = core.getInput('resource-group');
    const tenantId = core.getInput("tenant-id");
    const subscriptionId = core.getInput('subscription-id');
    const reportName = core.getInput('report-name');

    const resourceIds = await getResourceIdsByDeployment(cred, subscriptionId, resourceGroupName, deploymentName);
    const subscriptionIds = resourceIds.map(id => getResourceSubscription(id));

    await onboard(token, tenantId, subscriptionIds);
    core.info(`Successfully onboarded subscriptions`);
    await waitOnboardFinish();

    await createOrUpdateReport(cred, reportName, resourceIds);
    core.info(`Successfully created or updated report ${reportName}`);

    core.info("Evaluating policy states for all subscriptions...");
    await getPolicyStates(cred, resourceIds);

  } catch (error) {
    core.setFailed(error.message);
  }
}

start();
