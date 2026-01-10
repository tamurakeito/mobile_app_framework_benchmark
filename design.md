# Flutter vs Tauri 技術比較検証 - 設計書

## 1. 検証目的

Flutter と Tauri のネイティブアプリ開発における以下の項目を比較検証する：

- **バンドルサイズ**: 最終的なアプリケーションのファイルサイズ
- **パフォーマンス**: 起動時間、画面遷移速度、メモリ使用量
- **開発体験**: ネイティブ機能へのアクセスのしやすさ

---

## 2. サンプルアプリ構成

### 2.1 App A: Hello World アプリ（最小構成）

シンプルな「Hello, World!」を表示するだけのアプリ。
バンドルサイズの最小値を計測するためのベースライン。

**機能:**
- 画面に「Hello, World!」テキストを表示

---

### 2.2 App B: 機能検証アプリ（実践構成）

複数画面と状態管理、ネイティブ機能を含むアプリ。

**画面構成（6画面）:**

| 画面名 | 機能概要 |
|--------|----------|
| Home | メイン画面。各機能への導線 |
| Counter | カウンター機能。状態管理の検証 |
| API | REST API通信。データ取得・送信の検証 |
| Camera | カメラ撮影機能。撮影した画像の表示 |
| Notifications | プッシュ通知の送信テスト |
| Settings | 設定画面。テーマ切り替え（ダーク/ライト） |

**検証する機能:**

| 機能 | 検証内容 |
|------|----------|
| HTTP通信 | REST APIへのGET/POST、レスポンス処理、エラーハンドリング |
| カメラ | 写真撮影、撮影画像の取得・表示 |
| 通知 | ローカル通知の送信・受信 |
| ストレージ | ローカルへのデータ永続化（設定値の保存） |
| テーマ | システムテーマの取得、アプリテーマの切り替え |

**API画面の詳細:**

| 機能 | 説明 |
|------|------|
| ユーザー一覧取得 | GET リクエストでユーザーリストを取得・表示 |
| ユーザー作成 | POST リクエストで新規ユーザーを作成 |
| ローディング状態 | 通信中のローディングUI表示 |
| エラー表示 | 通信エラー時のエラーハンドリング・表示 |

※ モックAPIとして [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用

---

## 3. ディレクトリ構成

```
flutter_tauri_sandbox/
├── memo.md              # 検証の背景・目的
├── design.md            # 本設計書
├── results.md           # 計測結果（後で作成）
│
├── flutter/
│   ├── hello_world/     # App A: Hello World（Flutter）
│   └── feature_app/     # App B: 機能検証アプリ（Flutter）
│
└── tauri/
    ├── hello_world/     # App A: Hello World（Tauri）
    └── feature_app/     # App B: 機能検証アプリ（Tauri）
```

---

## 4. 技術スタック詳細

### 4.1 Flutter

| 項目 | 選定 |
|------|------|
| 言語 | Dart |
| 状態管理 | Riverpod |
| HTTP通信 | dio または http パッケージ |
| カメラ | camera パッケージ |
| 通知 | flutter_local_notifications |
| ストレージ | shared_preferences |
| ナビゲーション | go_router |

### 4.2 Tauri

| 項目 | 選定 |
|------|------|
| フロントエンド | React + TypeScript |
| 状態管理 | React Context（必要に応じて Zustand） |
| バックエンド | Rust（Tauri Core） |
| HTTP通信 | TanStack Query + fetch API |
| フォーム | React Hook Form |
| カメラ | tauri-plugin-camera または Web API + 権限要求 |
| 通知 | tauri-plugin-notification |
| ストレージ | tauri-plugin-store |
| ルーティング | TanStack Router |

---

## 5. 計測項目

### 5.1 バンドルサイズ

| 計測対象 | 単位 |
|----------|------|
| アプリバンドルサイズ（.app / .exe / .dmg） | MB |
| インストール後サイズ | MB |

### 5.2 パフォーマンス

| 計測項目 | 計測方法 |
|----------|----------|
| アプリ起動時間 | コールドスタートからHome画面表示まで（ms） |
| 画面遷移時間 | 画面間のナビゲーション時間（ms） |
| API通信時間 | リクエスト送信からレスポンス描画完了まで（ms） |
| メモリ使用量 | アイドル時・機能使用時のメモリ（MB） |
| CPU使用率 | アイドル時・機能使用時のCPU（%） |

### 5.3 開発体験（定性評価）

- ネイティブ機能へのアクセスのしやすさ
- HTTP通信の実装しやすさ
- デバッグのしやすさ
- ドキュメントの充実度
- エコシステム・ライブラリの豊富さ

---

## 6. 対象プラットフォーム

| プラットフォーム | Flutter | Tauri |
|------------------|---------|-------|
| macOS            | ○       | ○     |
| Windows          | ○       | ○     |
| iOS              | ○       | ○（v2.0〜） |
| Android          | ○       | ○（v2.0〜） |

※ Tauri 2.0 は 2024年10月に安定版リリース済み。iOS/Android を正式サポート。

**主要検証対象: iOS / Android**（モバイルアプリとして比較）

---

## 7. 実装順序

### Phase 1: Hello World アプリ

1. Flutter Hello World の作成
2. Tauri Hello World の作成
3. バンドルサイズの計測・比較

### Phase 2: 機能検証アプリ - 基本構成

4. Flutter: プロジェクト作成・画面遷移・状態管理
5. Tauri: プロジェクト作成・画面遷移・状態管理
6. パフォーマンス計測（基本）

### Phase 3: API通信・ネイティブ機能

7. REST API通信の実装（Flutter / Tauri）
8. カメラ機能の実装（Flutter / Tauri）
9. 通知機能の実装（Flutter / Tauri）
10. ストレージ・設定機能の実装（Flutter / Tauri）

### Phase 4: 計測・評価

11. 全項目の計測
12. 結果の整理・比較表作成
13. 考察・結論

---

## 8. 成果物

- 4つのサンプルアプリ（Flutter×2, Tauri×2）
- 計測結果ドキュメント（results.md）
- 技術選定の推奨事項
