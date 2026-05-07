import { NextResponse } from "next/server";
import { getCloudRunServices } from "@/lib/gcp-client";
import { getAllReposInfo } from "@/lib/github-client";
import { groupServices } from "@/lib/service-utils";

export async function GET() {
  try {
    const [services, repoMap] = await Promise.all([
      getCloudRunServices(),
      getAllReposInfo(),
    ]);

    const combinedData = groupServices(services, repoMap);

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
