# Cloud Run Service Management Portal

Google Cloud プロジェクト内の Cloud Run サービスを一覧表示し、各サービスへのクイックアクセスを提供するポータルサイトです。

## 主な機能

- **Cloud Run サービス一覧の自動取得**: Google Cloud SDK を使用して、指定したプロジェクト・リージョン内のサービスを自動的に取得します。
- **GitHub 連携**: サービス名と一致する GitHub リポジトリへのリンク、および Issue ページへのリンクを自動生成します。
- **Cloud Logging 直リンク**: 各サービスのログ確認画面へのショートカットを提供します。
- **リアルタイムフィルタリング**: サービス名による高速な検索機能。
- **レスポンシブデザイン**: Tailwind CSS を使用した、クリーンで使いやすい UI。

## 技術スタック

- **Frontend/Backend**: Next.js (App Router)
- **UI**: Tailwind CSS, Lucide-react
- **SDK/API**:
  - `@google-cloud/run`
  - `octokit` (GitHub API)

## セットアップ

### 環境変数の設定

`.env.local` ファイルを作成し、以下の変数を設定してください。

```env
GCP_PROJECT_ID=your-project-id
GCP_REGION=asia-northeast1
GITHUB_PAT=your-github-personal-access-token
GITHUB_OWNER=your-github-org-or-user
```

### 開発サーバーの起動

```bash
npm install
npm run dev
```

### ビルドとデプロイ

```bash
npm run build
# Cloud Run 等へのデプロイ
```

## ライセンス

MIT
