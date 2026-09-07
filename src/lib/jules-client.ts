/**
 * Jules API クライアントライブラリ
 *
 * このファイルは、Jules API（jules.googleapis.com）へのリクエストを抽象化します。
 * すべてのコードコメントは、AGENTS.mdの指示に基づき日本語で記述されています。
 */

export interface JulesSource {
  name: string; // 例: "sources/github/owner/repo"
  id: string;   // 例: "github/owner/repo"
  githubRepo?: {
    owner: string;
    repo: string;
  };
}

export interface CreateSessionRequest {
  prompt: string;
  sourceContext: {
    source: string;
    githubRepoContext?: {
      startingBranch?: string;
    };
  };
  automationMode?: "AUTO_CREATE_PR" | "NO_PR";
  title?: string;
}

export interface JulesSession {
  name: string; // 例: "sessions/31415926535897932384"
  id: string;
  title: string;
  prompt: string;
  sourceContext: {
    source: string;
    githubRepoContext?: {
      startingBranch?: string;
    };
  };
  createTime?: string;
}

/**
 * APIキーをログ出力用に安全にマスクします。
 */
function maskApiKey(apiKey: string): string {
  if (!apiKey) return "(empty)";
  if (apiKey.length <= 8) return "***";
  return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
}

/**
 * Jules API に接続されているすべてのソース（リポジトリ）の一覧を取得します。
 * ページネーションを自動的に処理して全件取得します。
 *
 * @param apiKey Jules API キー
 * @returns 取得されたソースの配列
 */
export async function listAllJulesSources(apiKey: string): Promise<JulesSource[]> {
  let sources: JulesSource[] = [];
  let pageToken = "";

  console.log(`[JulesClient] Jules ソース一覧の取得を開始します... (ApiKey: ${maskApiKey(apiKey)})`);

  do {
    const url = new URL("https://jules.googleapis.com/v1alpha/sources");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    console.log(`[JulesClient] GET Request -> ${url.toString()}`);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[JulesClient] Jules API ソース一覧の取得に失敗しました: Status=${res.status} ${res.statusText}, URL=${url.toString()}, Response=${errText}`);
      throw new Error(`Jules API ソース一覧の取得に失敗しました: ${res.status} ${res.statusText} - ${errText}`);
    }

    const data = await res.json();
    console.log(`[JulesClient] GET Response <- ${res.status} ${res.statusText}, SourcesCount=${data.sources?.length || 0}, NextPageToken=${data.nextPageToken || "none"}`);

    if (data.sources) {
      sources = sources.concat(data.sources);
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  console.log(`[JulesClient] Jules ソース一覧の取得に成功しました。合計: ${sources.length}件`);
  return sources;
}

/**
 * Jules API に存在するすべてのセッション一覧を取得します。
 * ページネーションを自動的に処理して全件取得します。
 *
 * @param apiKey Jules API キー
 * @returns 取得されたセッションの配列
 */
export async function listAllJulesSessions(apiKey: string): Promise<JulesSession[]> {
  let sessions: JulesSession[] = [];
  let pageToken = "";

  console.log(`[JulesClient] Jules セッション一覧の取得を開始します... (ApiKey: ${maskApiKey(apiKey)})`);

  do {
    const url = new URL("https://jules.googleapis.com/v1alpha/sessions");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    console.log(`[JulesClient] GET Request -> ${url.toString()}`);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[JulesClient] Jules API セッション一覧の取得に失敗しました: Status=${res.status} ${res.statusText}, URL=${url.toString()}, Response=${errText}`);
      throw new Error(`Jules API セッション一覧の取得に失敗しました: ${res.status} ${res.statusText} - ${errText}`);
    }

    const data = await res.json();
    console.log(`[JulesClient] GET Response <- ${res.status} ${res.statusText}, SessionsCount=${data.sessions?.length || 0}, NextPageToken=${data.nextPageToken || "none"}`);

    if (data.sessions) {
      sessions = sessions.concat(data.sessions);
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  console.log(`[JulesClient] Jules セッション一覧の取得に成功しました。合計: ${sessions.length}件`);
  return sessions;
}

/**
 * 直近24時間（ローリングウィンドウ）に作成された Jules セッション数を計算し、
 * 残り作成可能なセッション数を返します（最大上限15セッション）。
 *
 * @param apiKey Jules API キー
 * @returns 残り作成可能なセッション数 (0〜15)
 */
export async function getRemainingSessionCapacity(apiKey: string): Promise<number> {
  const MAX_SESSIONS_24H = 15;
  const sessions = await listAllJulesSessions(apiKey);
  const now = Date.now();
  const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

  const recentSessions = sessions.filter((session) => {
    if (!session.createTime) return false;
    const createTime = new Date(session.createTime).getTime();
    return !isNaN(createTime) && createTime >= twentyFourHoursAgo;
  });

  const remaining = MAX_SESSIONS_24H - recentSessions.length;
  console.log(`[JulesClient] 直近24時間のセッション数: ${recentSessions.length} / ${MAX_SESSIONS_24H}, 残り作成枠: ${remaining}`);
  return Math.max(0, remaining);
}

/**
 * 新しい Jules セッションを作成し、指定のタスクを開始します。
 * automationMode に "AUTO_CREATE_PR" を設定することで、計画、修正、検証、PR作成を自動で行うことができます。
 *
 * @param apiKey Jules API キー
 * @param req セッション作成リクエストパラメータ
 * @returns 作成されたセッション情報
 */
export async function createJulesSession(
  apiKey: string,
  req: CreateSessionRequest
): Promise<JulesSession> {
  const url = "https://jules.googleapis.com/v1alpha/sessions";
  const requestBodyStr = JSON.stringify(req, null, 2);

  console.log(`[JulesClient] Jules セッション作成リクエストを送信します:`);
  console.log(`[JulesClient] POST Request -> ${url} (ApiKey: ${maskApiKey(apiKey)})`);
  console.log(`[JulesClient] Request Body:\n${requestBodyStr}`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[JulesClient] Jules セッションの作成に失敗しました: Status=${res.status} ${res.statusText}`);
    console.error(`[JulesClient] Response Body:\n${errText}`);
    console.error(`[JulesClient] Sent Request Payload:\n${requestBodyStr}`);
    throw new Error(`Jules セッションの作成に失敗しました: ${res.status} ${res.statusText} - ${errText}`);
  }

  const responseText = await res.text();
  console.log(`[JulesClient] POST Response <- ${res.status} ${res.statusText}`);
  console.log(`[JulesClient] Response Body:\n${responseText}`);

  const sessionData: JulesSession = JSON.parse(responseText);
  console.log(`[JulesClient] Jules セッションの作成に成功しました: Name=${sessionData.name}, ID=${sessionData.id}`);
  return sessionData;
}
