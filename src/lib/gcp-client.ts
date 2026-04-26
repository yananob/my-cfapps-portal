import { ServicesClient } from "@google-cloud/run";

const projectId = process.env.GCP_PROJECT_ID;
const region = process.env.GCP_REGION || "asia-northeast1";

const client = new ServicesClient();

export interface CloudRunService {
  name: string;
  url: string;
  logUrl: string;
}

export async function getCloudRunServices(): Promise<CloudRunService[]> {
  if (!projectId) {
    console.warn("GCP_PROJECT_ID is not set");
    return [];
  }

  const parent = `projects/${projectId}/locations/${region}`;

  try {
    const [services] = await client.listServices({ parent });

    return (services || []).map((service) => {
      const name = service.name?.split("/").pop() || "";
      const url = service.uri || "";
      const logUrl = `https://console.cloud.google.com/run/detail/${region}/${name}/logs?project=${projectId}`;

      return {
        name,
        url,
        logUrl,
      };
    });
  } catch (error) {
    console.error("Error fetching Cloud Run services:", error);
    return [];
  }
}
