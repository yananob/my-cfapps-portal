#!/bin/bash
set -e

# カレントディレクトリをプロジェクトのルートに移動
cd "$(dirname "$0")/.."

echo "Running Vitest..."
npm test
