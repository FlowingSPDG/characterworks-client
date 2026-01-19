# セットアップ手順

このドキュメントは、`characterworks-http-client` を GitHub リポジトリに移行し、npm 公開して、既存の Stream Deck プラグインで使用するまでの手順を説明します。

## 1. GitHub リポジトリへの移行

既にリポジトリ `https://github.com/FlowingSPDG/characterworks-js` が作成されているので、以下の手順でファイルを push します：

```bash
# characterworks-http-client ディレクトリに移動
cd characterworks-http-client

# Git リポジトリを初期化（まだの場合）
git init

# リモートを追加
git remote add origin https://github.com/FlowingSPDG/characterworks-js.git

# ファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: CharacterWorks HTTP client library"

# main ブランチに push
git branch -M main
git push -u origin main
```

## 2. npm 公開の準備

### 2.1 npm アカウントの設定

npm にログインし、スコープ `@streamdeckcw` が利用可能か確認します：

```bash
npm login
npm whoami
```

スコープが利用できない場合は、npm の設定でスコープを有効化するか、パッケージ名を変更する必要があります。

### 2.2 GitHub Secrets の設定

GitHub Actions で自動公開するために、リポジトリの Settings > Secrets and variables > Actions で以下を設定：

- `NPM_TOKEN`: npm のアクセストークン（`npm token create --read-only=false` で作成）

### 2.3 GitHub Actions ワークフローの追加

`.github/workflows/ci.yml` と `.github/workflows/release.yml` を手動で作成するか、以下の内容をコピーしてください：

**`.github/workflows/ci.yml`**:
```yaml
name: CI

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

**`.github/workflows/release.yml`**:
```yaml
name: Release

on:
  push:
    tags:
      - "v*.*.*"

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Verify package.json version matches tag
        run: |
          TAG_VERSION="${GITHUB_REF#refs/tags/v}"
          PKG_VERSION=$(node -p "require('./package.json').version")
          if [ "$TAG_VERSION" != "$PKG_VERSION" ]; then
            echo "Error: package.json version ($PKG_VERSION) does not match tag version ($TAG_VERSION)"
            exit 1
          fi

      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 3. 初回 npm 公開

### 方法 A: 手動公開

```bash
cd characterworks-http-client
npm run build
npm publish --access public
```

### 方法 B: GitHub Actions 経由（推奨）

```bash
cd characterworks-http-client
npm version patch  # 0.1.0 -> 0.1.1
git push && git push --tags
```

タグが push されると、GitHub Actions が自動的にビルドして npm に公開します。

## 4. Stream Deck プラグインでの使用

### 4.1 依存関係の追加

Stream Deck プラグインの `package.json` に追加：

```json
{
  "dependencies": {
    "@streamdeckcw/characterworks-client": "^0.1.0"
  }
}
```

### 4.2 インポートの変更

`src/actions/*.ts` ファイルで、以下のように変更：

**変更前**:
```ts
import { sendCommand, createTriggerCommand } from '../lib/characterworks'
```

**変更後**:
```ts
import { sendCommand, createTriggerCommand } from '@streamdeckcw/characterworks-client'
```

### 4.3 ローカル開発時の注意

npm 公開前は、ローカルで開発する場合、以下のいずれかを使用：

1. **npm link**:
   ```bash
   cd characterworks-http-client
   npm link
   cd ../streamdeckcw
   npm link @streamdeckcw/characterworks-client
   ```

2. **file: プロトコル**（一時的）:
   ```json
   {
     "dependencies": {
       "@streamdeckcw/characterworks-client": "file:../characterworks-http-client"
     }
   }
   ```

### 4.4 古いコードの削除

npm パッケージが正常に動作することを確認後、`src/lib/characterworks/` ディレクトリを削除：

```bash
rm -rf src/lib/characterworks
```

## 5. 今後のリリースフロー

1. 機能追加やバグ修正を feature ブランチで実装
2. PR を作成してマージ（CI が自動実行）
3. バージョンを上げてタグを push:
   ```bash
   npm version patch  # または minor, major
   git push && git push --tags
   ```
4. GitHub Actions が自動的に npm に公開

## トラブルシューティング

### npm 公開時にスコープエラーが出る場合

`package.json` の `publishConfig.access` が `"public"` になっているか確認してください。

### TypeScript の型定義が見つからない場合

`npm run build` を実行して `dist/index.d.ts` が生成されているか確認してください。

### Stream Deck プラグインのビルドでエラーが出る場合

Rollup の設定で `@streamdeckcw/characterworks-client` を external として扱う必要があるかもしれません。`rollup.config.mjs` を確認してください。
