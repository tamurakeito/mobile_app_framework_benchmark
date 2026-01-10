# Flutter vs Tauri 計測結果

## Phase 1: Hello World アプリ バンドルサイズ

### Android APK

| フレームワーク | サイズ | 備考 |
|--------------|--------|------|
| Flutter | 39 MB | fat APK (全アーキテクチャ含む) |
| Tauri | 28 MB | universal APK (全アーキテクチャ含む) |

**差分: Tauri が約 28% 小さい**

### iOS App

| フレームワーク | サイズ | 備考 |
|--------------|--------|------|
| Flutter | 13 MB | arm64 |
| Tauri | 4.1 MB | arm64 |

**差分: Tauri が約 68% 小さい**

---

## 備考

- Flutter APK はデフォルトで fat APK（arm64-v8a, armeabi-v7a, x86_64 を含む）
- Tauri APK も全アーキテクチャ向けの universal APK
- Tauri iOS ビルドには Apple Developer Team の設定が必要

---

## 環境

- macOS Darwin 24.6.0
- Flutter 3.38.5
- Tauri 2.9.6
- Rust 1.92.0
- Android SDK 36.0 / NDK 29.0
