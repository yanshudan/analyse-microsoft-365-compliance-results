import { ResourceManagementClient, ResourceReference } from "@azure/arm-resources";
import { AzureCliCredential } from "@azure/identity";

export async function getResourceIdsByDeployment(
  cred: AzureCliCredential,
  deploymentId: string
): Promise<string[]> {

  const tokens = deploymentId.split("/");
  const deploymentMeta = new Map<string, string>()
  for (let i = 0; i < tokens.length - 1; i = i + 2) {
    deploymentMeta.set(tokens[i], tokens[i + 1]);
  }

  const depclient = new ResourceManagementClient(cred, deploymentMeta.get("subscriptions") ?? "");
  const deployment = await depclient.deployments.get(deploymentMeta.get("resourceGroups") ?? "", deploymentMeta.get("deployments") ?? "");
  return deployment.properties?.outputResources?.map(
    (resource: ResourceReference) => {
      return resource.id ?? "null"
    }
  ) ?? [];
}
