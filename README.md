# mobile-design-os-w

React Native / Expo 向けの方式設計書を Storybook Docs で閲覧するための docs-only ワークスペースです。

## 目的

- 方式設計書を `docs/architecture/handbook/` 配下に集約する
- Storybook をドキュメント閲覧基盤として使う
- 一時ファイル置き場と正式文書置き場を分離する

## ディレクトリ構成

```text
.
├── .storybook/                  # Storybook 設定
├── docs/
│   └── architecture/
│       └── handbook/            # 正式な MDX 文書
│           ├── foundation/
│           ├── quality/
│           ├── operations/
│           ├── platform/
│           └── integrations/
│   └── reference/
│       └── api/                 # Swagger UI / OpenAPI 参照
├── scripts/                     # ドキュメント検証スクリプト
└── dist/                        # Storybook ビルド成果物
```

## コマンド

- `pnpm storybook`: ローカルで Storybook を起動
- `pnpm build-storybook`: `dist/storybook/` に静的ファイルを出力
- `pnpm docs:check`: MDX ドキュメントの基本整合性を検証

## 運用ルール

- 正式文書は `docs/architecture/handbook/` 配下に置く
- OpenAPI 参照は `docs/reference/api/` 配下に置き、Storybook では `Reference/API/...` に出す
- 一時ファイルは `tmp/` を再利用せず、必要なら別途 `.gitignore` 対象の作業ディレクトリを作る
- Storybook の章順は `.storybook/preview.ts` の `storySort.order` で管理する
- 現在のワークスペース名 `mobile design-os_w` は命名規則が不統一です。実運用では `mobile-design-os-w` へリネームするのが正解です
