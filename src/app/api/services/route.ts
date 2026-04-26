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
  } catch (error: any) {
    console.error("API error:", error);

    // エラーメッセージをクライアントに返す（デバッグ用だが、指示書にはプライベートポータルとあるので許容）
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
