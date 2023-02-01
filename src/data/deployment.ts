import { ResourceManagementClient, ResourceReference } from "@azure/arm-resources";
import { AzureCliCredential } from "@azure/identity";

export async function getResourceIdsByDeployment(
  cred: AzureCliCredential,
  subscriptionId: string,
  resourceGroupName: string,
  deploymentName: string
): Promise<string[]> {

  const depclient = new ResourceManagementClient(cred, subscriptionId);
  const deployment = await depclient.deployments.get(resourceGroupName, deploymentName);

  return deployment.properties?.outputResources?.map(
    (resource: ResourceReference) => {
      return resource.id ?? "null"
    }
  ) ?? [];
}
