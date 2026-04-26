import { Octokit } from "octokit";

const githubPat = process.env.GITHUB_PAT;
const githubOwner = process.env.GITHUB_OWNER;

const octokit = new Octokit({ auth: githubPat });

export interface GitHubRepoInfo {
  repoUrl: string;
  issueUrl: string;
}

/**
 * すべてのリポジトリ情報を取得し、リポジトリ名をキーにしたマップを返します。
 * N+1問題を避けるため、一括で取得します。
 */
export async function getAllReposInfo(): Promise<Map<string, GitHubRepoInfo>> {
  if (!githubOwner) {
    console.error("GITHUB_OWNER is not set");
    return new Map();
  }

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
      });
    }
    return repoMap;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return new Map();
  }
}
