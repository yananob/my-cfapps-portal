import { NextResponse } from "next/server";
import { getCloudRunServices } from "@/lib/gcp-client";
import { getAllReposInfo } from "@/lib/github-client";
import { ServiceGroup } from "@/lib/types";

export async function GET() {
  try {
    const [services, repoMap] = await Promise.all([
      getCloudRunServices(),
      getAllReposInfo(),
    ]);

    const groupsMap = new Map<string, ServiceGroup>();

    for (const service of services) {
      let baseName = service.name;
      let type: "main" | "test" | "event" | "testEvent" = "main";

      if (service.name.endsWith("-test-event")) {
        baseName = service.name.replace(/-test-event$/, "");
        type = "testEvent";
      } else if (service.name.endsWith("-test")) {
        baseName = service.name.replace(/-test$/, "");
        type = "test";
      } else if (service.name.endsWith("-event")) {
        baseName = service.name.replace(/-event$/, "");
        type = "event";
      }

      let group = groupsMap.get(baseName);
      if (!group) {
        const repoInfo = repoMap.get(baseName);
        group = {
          baseName,
          repoUrl: repoInfo?.repoUrl,
          issueUrl: repoInfo?.issueUrl,
        };
        groupsMap.set(baseName, group);
      }

      group[type] = {
        url: service.url,
        logUrl: service.logUrl,
      };
    }

    const combinedData = Array.from(groupsMap.values()).sort((a, b) =>
      a.baseName.localeCompare(b.baseName)
    );

    return NextResponse.json(combinedData);
  } catch (error: any) {
    console.error("API error:", error);

    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
