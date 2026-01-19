# CharacterWorks Client Examples

このディレクトリには、`characterworks-client`の動作確認用のサンプルコードが含まれています。

## セットアップ

まず、プロジェクトの依存関係をインストールしてください：

```bash
npm install
```

## 実行方法

### 基本的な接続確認

```bash
npm run example:basic
```

または

```bash
npx tsx examples/basic-connection.ts
```

CharacterWorksサーバーへの基本的な接続をテストし、簡単なコマンドを送信します。

### すべてのコマンドタイプの例

```bash
npm run example:all
```

または

```bash
npx tsx examples/all-commands.ts
```

利用可能なすべてのコマンドタイプ（Trigger、SetText、ActivateGrid）の使用例を実行します。

## 注意事項

- CharacterWorksサーバーが起動していることを確認してください
- デフォルトでは `127.0.0.1:7000` に接続します
- サーバーのホストやポートが異なる場合は、スクリプト内の `config` を変更してください
