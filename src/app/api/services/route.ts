import { NextResponse } from "next/server";
import { getCloudRunServices } from "@/lib/gcp-client";
import { getAllReposInfo } from "@/lib/github-client";

export async function GET() {
  try {
    const [services, repoMap] = await Promise.all([
      getCloudRunServices(),
      getAllReposInfo(),
    ]);

    const combinedData = services.map((service) => {
      const repoInfo = repoMap.get(service.name);
      return {
        id: service.name,
        url: service.url,
        logUrl: service.logUrl,
        repoUrl: repoInfo?.repoUrl,
        issueUrl: repoInfo?.issueUrl,
      };
    });

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
