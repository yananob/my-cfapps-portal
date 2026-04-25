# Cloud Run サービス管理ポータル構築指示書

## 1. プロジェクト概要
Google Cloud プロジェクト内の Cloud Run サービスを正（ソース）として自動取得し、各サービスへのリンク（エンドポイント、GitHubリポジトリ、Issue、Cloud Logging）を一覧表示するプライベートなポータルサイトを構築する。

## 2. 技術スタック
- **Frontend/Backend:** Next.js (App Router / TypeScript)
- **UI:** Tailwind CSS, Lucide-react (アイコン用)
- **API連携:**
    - `@google-cloud/run`: Cloud Run サービス一覧の取得
    - `octokit`: GitHub API を利用したリポジトリ情報の取得
- **インフラ:** Cloud Run へのデプロイを想定
- **認証:** IAP (Identity-Aware Proxy) による保護を前提とするため、アプリ内認証ロジックは不要

## 3. 実装要件

### A. バックエンドロジック (Server Components / Actions)
1. **Cloud Run API 連携:**
    - `ServicesClient` を使用し、指定したプロジェクト・リージョン内のサービス一覧を取得する。
    - 各サービスから `name` (サービス名) と `uri` (エンドポイント) を抽出する。
2. **GitHub API 連携:**
    - Cloud Run のサービス名とリポジトリ名が一致すると仮定し、GitHub API でリポジトリの `html_url` を取得する。
    - 一致するリポジトリがない場合は、リンクを非活性にするかエラーを表示しないよう制御する。
3. **データ構造:**
    - 以下の構造を持つオブジェクトの配列を生成する。
      ```typescript
      {
        id: string;          // サービス名
        url: string;         // Cloud Run サービスURL
        repoUrl: string;     // GitHub リポジトリURL ([https://github.com/USER/REPO](https://github.com/USER/REPO))
        issueUrl: string;    // GitHub Issue URL ([https://github.com/USER/REPO/issues](https://github.com/USER/REPO/issues))
        logUrl: string;      // Google Cloud Logging 直リンク
      }
      ```
    - **Log URL 生成規則:**
      `https://console.cloud.google.com/run/detail/[REGION]/[SERVICE_NAME]/logs?project=[PROJECT_ID]`

### B. フロントエンド UI (Page)
1. **ダッシュボード:**
    - カードレイアウトでサービス一覧を表示。
    - サービス名によるリアルタイムフィルタリング機能（検索バー）。
2. **コンポーネント:**
    - 各カードに「App」「Repo」「Issue」「Log」の4つの外部リンクボタンを配置。
    - ダークモード対応、またはエンジニア好みのクリーンなデザイン。

## 4. 環境変数設定 (.env.local)
以下の変数を使用する実装にすること。
- `GCP_PROJECT_ID`: Google Cloud プロジェクト ID
- `GCP_REGION`: Cloud Run のリージョン (例: asia-northeast1)
- `GITHUB_PAT`: GitHub Personal Access Token (Repo 読み取り権限)
- `GITHUB_OWNER`: GitHub のユーザー名または組織名

## 5. 期待する出力ファイル構成
- `src/lib/gcp-client.ts`: Google Cloud SDK の初期化とデータ取得ロジック
- `src/lib/github-client.ts`: Octokit の初期化とデータ取得ロジック
- `src/app/page.tsx`: メインのダッシュボード画面
- `src/components/ServiceCard.tsx`: 各サービスを表示するカードコンポーネント
