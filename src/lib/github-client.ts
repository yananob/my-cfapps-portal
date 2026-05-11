import { Octokit } from "octokit";

export interface GitHubRepoInfo {
  repoUrl: string;
  issueUrl: string;
  julesUrl: string;
}

/**
 * すべてのリポジトリ情報を取得し、リポジトリ名をキーにしたマップを返します。
 * N+1問題を避けるため、一括で取得します。
 */
export async function getAllReposInfo(): Promise<Map<string, GitHubRepoInfo>> {
  const githubPat = process.env.GITHUB_PAT;
  const githubOwner = process.env.GITHUB_OWNER;

  if (!githubOwner) {
    throw new Error("GITHUB_OWNER is not set");
  }

  const octokit = new Octokit({ auth: githubPat });

  try {
    // 認証ユーザーがアクセス可能なすべてのリポジトリを取得（パブリック・プライベート両方）
    const allRepos = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
      visibility: "all",
      per_page: 100,
    });

    // 指定されたオーナー（ユーザーまたは組織）のリポジトリのみにフィルタリング
    const repos = allRepos.filter(
      (repo) => repo.owner.login.toLowerCase() === githubOwner.toLowerCase()
    );

    const repoMap = new Map<string, GitHubRepoInfo>();
    for (const repo of repos) {
      // アーカイブされたリポジトリを除外
      if (repo.archived) continue;

      repoMap.set(repo.name, {
        repoUrl: repo.html_url,
        issueUrl: `${repo.html_url}/issues`,
        julesUrl: `https://jules.google.com/repo/github/${githubOwner}/${repo.name}/`,
      });
    }
    return repoMap;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw error;
  }
}
