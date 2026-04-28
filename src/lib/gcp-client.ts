import { ServicesClient } from "@google-cloud/run";

let client: ServicesClient | null = null;

function getClient() {
  if (!client) {
    client = new ServicesClient();
  }
  return client;
}

export interface CloudRunService {
  name: string;
  url: string;
  logUrl: string;
}

export async function getCloudRunServices(): Promise<CloudRunService[]> {
  const projectId = process.env.GCP_PROJECT_ID;
  const region = process.env.GCP_REGION || "asia-northeast1";

  if (!projectId) {
    throw new Error("GCP_PROJECT_ID is not set");
  }

  const client = getClient();
  const parent = `projects/${projectId}/locations/${region}`;

  try {
    const [services] = await client.listServices({ parent });

    return (services || []).map((service) => {
      const name = service.name?.split("/").pop() || "";
      const url = service.uri || "";
      const logUrl = `https://console.cloud.google.com/run/observability/${region}/${name}/logs?project=${projectId}&supportedpurview=project`;

      return {
        name,
        url,
        logUrl,
      };
    });
  } catch (error) {
    console.error("Error fetching Cloud Run services:", error);
    throw error;
  }
}
