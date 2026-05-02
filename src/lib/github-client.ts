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
    const repos = await octokit.paginate(octokit.rest.repos.listForOrg, {
      org: githubOwner,
      per_page: 100,
    }).catch(() =>
      octokit.paginate(octokit.rest.repos.listForUser, {
        username: githubOwner,
        per_page: 100,
      })
    );

    const repoMap = new Map<string, GitHubRepoInfo>();
    for (const repo of repos) {
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
