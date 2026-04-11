# mobile-design-os-w

React 19 + Vite + Storybook 10 を使って、モバイルアプリ向け UI、画面遷移、状態管理、方式設計書をブラウザ上で検証するワークスペースです。  
このリポジトリは **Expo/React Native 本体ではありません**。実行面の中心は Storybook で、設計文書と画面実装を同じ場所で管理しています。

## 位置付け

- モバイルアプリの方式設計書を `docs/architecture/handbook/` に集約する
- UI コンポーネント、画面、ガード、Provider を `src/` に実装し、Storybook で確認する
- OpenAPI 参照を `docs/reference/api/` に置き、Swagger UI で閲覧する
- Vitest + Testing Library で UI とロジックの回帰を抑える

## リポジトリの実態

2026-04-11 時点の実ファイルベースでは、以下の構成です。

- 方式設計書: `29` 本の MDX
- Storybook story: `39` 本
- Vitest テスト: `59` 本
- UI コンポーネント群: `26` ディレクトリ
- Feature ドメイン: `8` 個

Feature ドメインは `auth`、`notifications`、`onboarding`、`orders`、`payment`、`profile`、`search`、`settings` です。  
アプリ層には `RootAppShell`、`AuthRouteGuard`、`MainRouteGuard`、`MainAppNavigator` があり、`src/lib/appRouter.ts` でブラウザ履歴を使った疑似ルーターを提供しています。

## 何が入っているか

- 方式設計書: `docs/architecture/handbook/`
- OpenAPI リファレンス: `docs/reference/api/mobile-design-os.openapi.json`
- App Shell / Route Guard / Navigator: `src/app/`
- Provider 群: `src/components/providers/`
- レイアウトテンプレート: `src/components/templates/`
- Design System UI: `src/components/ui/`
- 機能別画面とロジック: `src/features/`
- 共通フック: `src/hooks/`
- 基盤ライブラリ: `src/lib/`
- 外部ストア: `src/stores/`
- デザイントークン: `src/tokens/`
- Storybook / Docs 検証スクリプト: `.storybook/`, `scripts/`

## ディレクトリ構成

```text
.
├── .storybook/                  # Storybook 10 設定
├── docs/
│   ├── architecture/handbook/   # 方式設計書 (MDX)
│   └── reference/api/           # OpenAPI と Swagger UI 用 Story
├── scripts/
│   └── check-docs.mjs           # MDX Meta title の整合性検証
├── src/
│   ├── app/                     # Root shell / route guards / navigator
│   ├── components/
│   │   ├── providers/           # Theme, feature flag, privacy, notify
│   │   ├── templates/           # AuthLayout, MainLayout
│   │   └── ui/                  # Button, Modal, Toast, WebView など
│   ├── features/                # auth, orders, payment などの画面実装
│   ├── hooks/                   # deep link, reduced motion など
│   ├── lib/                     # analytics, sentry, router, webview, env
│   ├── stores/                  # auth / notify / order / theme
│   ├── styles/                  # global.css
│   ├── test/                    # Vitest 共通 setup
│   ├── tokens/                  # color / spacing / typography token
│   └── types/
├── dist/storybook/              # Storybook ビルド成果物
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── vitest.config.ts
```

## セットアップ

```bash
pnpm install
```

Node.js は Storybook 10 / Vite 8 / TypeScript 6 が動くバージョンを使ってください。  
パッケージマネージャは `pnpm@10.25.0` 固定です。

## 実行コマンド

- `pnpm storybook`
  Storybook 開発サーバを `http://localhost:6006` で起動します。
- `pnpm build-storybook`
  静的 Storybook を `dist/storybook/` に出力します。
- `pnpm test`
  `src/**/*.test.ts(x)` を jsdom で実行します。
- `pnpm typecheck`
  TypeScript の型チェックを実行します。
- `pnpm docs:check`
  `docs/architecture/handbook/**/*.mdx` の `<Meta title="..."/>` を検証します。

## 環境変数

`src/lib/env.ts` で以下を解釈しています。

- `EXPO_PUBLIC_API_BASE_URL`
  API ベース URL。URL 形式のみ許可。
- `EXPO_PUBLIC_APP_ENV`
  `development` / `staging` / `production`。
- `EXPO_PUBLIC_SENTRY_DSN`
  Sentry DSN。
- `EXPO_PUBLIC_APP_VERSION`
  アプリバージョン文字列。
- `EXPO_PUBLIC_FEATURE_NEW_CHECKOUT`
  `true` で新チェックアウトフローを有効化。
- `EXPO_PUBLIC_FEATURE_RECOMMENDATIONS`
  `true` でレコメンデーション表示を有効化。

`EXPO_PUBLIC_APP_ENV=production` のときに環境変数の整合性が崩れていると、初期化時に例外を投げます。

## Storybook と Docs のルール

- Storybook は `../docs/**/*.mdx`、`../docs/**/*.stories.@(ts|tsx)`、`../src/**/*.stories.@(ts|tsx)` を読み込みます
- Preview 幅は `responsive`、`320`、`375`、`390`、`430`、`768` の切り替えを toolbar から行います
- 章順は `.storybook/preview.ts` の `storySort.order` で固定しています
- `docs:check` は `Architecture/Handbook/` で始まる `Meta title` を必須にしています
- OpenAPI 表示は `swagger-ui-react` を使い、`docs/reference/api/openapi-example.stories.tsx` で描画します

## 現状の制約

- このリポジトリには Expo エントリポイント、`app.json`、`eas.json`、Metro 設定、`.rnstorybook/` はありません
- 通常の Vite アプリ入口 (`index.html` や `src/main.tsx`) もありません
- つまり、ここで再現できるのは **Web 上の UI・導線・状態・文書検証** までです
- 方式設計書には on-device Storybook、addon-vitest、addon-a11y、Chromatic 前提の記述がありますが、現行 `package.json` に入っているのはその全量ではありません

## 判断

このリポジトリは「設計書だけの置き場」ではありません。  
正確には、**モバイルアプリ方式設計書 + UI 実装モック + Storybook 検証基盤** を同居させた設計検証用ワークスペースです。
