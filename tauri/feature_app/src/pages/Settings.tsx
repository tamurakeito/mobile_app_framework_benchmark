import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { load, Store } from "@tauri-apps/plugin-store";

interface Settings {
  notificationsEnabled: boolean;
  username: string;
  fontSize: number;
  theme: "system" | "light" | "dark";
}

const defaultSettings: Settings = {
  notificationsEnabled: true,
  username: "",
  fontSize: 16,
  theme: "system",
};

export default function Settings() {
  const [store, setStore] = useState<Store | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = async () => {
    try {
      const s = await load("settings.json");
      setStore(s);

      const notificationsEnabled =
        (await s.get<boolean>("notificationsEnabled")) ??
        defaultSettings.notificationsEnabled;
      const username =
        (await s.get<string>("username")) ?? defaultSettings.username;
      const fontSize =
        (await s.get<number>("fontSize")) ?? defaultSettings.fontSize;
      const theme =
        (await s.get<"system" | "light" | "dark">("theme")) ??
        defaultSettings.theme;

      setSettings({
        notificationsEnabled,
        username,
        fontSize,
        theme,
      });
    } catch (error) {
      console.error("Failed to load store:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveValue = async <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    if (!store) return;
    await store.set(key, value);
    await store.save();
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationsChange = async () => {
    await saveValue("notificationsEnabled", !settings.notificationsEnabled);
  };

  const handleUsernameSubmit = async () => {
    await saveValue("username", usernameInput);
    setShowUsernameDialog(false);
  };

  const handleFontSizeChange = async (value: number) => {
    await saveValue("fontSize", value);
  };

  const handleThemeChange = async (theme: "system" | "light" | "dark") => {
    await saveValue("theme", theme);
    setShowThemeDialog(false);
  };

  const handleClearAll = async () => {
    if (!store) return;
    if (!confirm("すべての設定を初期値に戻しますか？")) return;

    await store.clear();
    await store.save();
    setSettings(defaultSettings);
  };

  const themeLabel = {
    system: "システム設定に従う",
    light: "ライト",
    dark: "ダーク",
  };

  if (isLoading) {
    return (
      <div className="page">
        <header className="header">
          <Link to="/" className="back-button">
            ← 戻る
          </Link>
          <h1>Settings</h1>
        </header>
        <main className="settings-content">
          <div className="loading">読み込み中...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <Link to="/" className="back-button">
          ← 戻る
        </Link>
        <h1>Settings</h1>
        <button onClick={handleClearAll} className="reset-button">
          クリア
        </button>
      </header>

      <main className="settings-content">
        {/* ユーザー設定 */}
        <div className="settings-section">
          <h2 className="section-title">ユーザー設定</h2>
          <div
            className="settings-item clickable"
            onClick={() => {
              setUsernameInput(settings.username);
              setShowUsernameDialog(true);
            }}
          >
            <div className="item-icon">👤</div>
            <div className="item-content">
              <div className="item-label">ユーザー名</div>
              <div className="item-value">
                {settings.username || "未設定"}
              </div>
            </div>
            <div className="item-arrow">›</div>
          </div>
        </div>

        {/* 通知設定 */}
        <div className="settings-section">
          <h2 className="section-title">通知設定</h2>
          <div className="settings-item">
            <div className="item-icon">🔔</div>
            <div className="item-content">
              <div className="item-label">通知を有効にする</div>
              <div className="item-value">
                {settings.notificationsEnabled ? "オン" : "オフ"}
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={handleNotificationsChange}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* 表示設定 */}
        <div className="settings-section">
          <h2 className="section-title">表示設定</h2>
          <div className="settings-item">
            <div className="item-icon">🔤</div>
            <div className="item-content">
              <div className="item-label">フォントサイズ: {settings.fontSize}</div>
              <input
                type="range"
                min="12"
                max="24"
                step="2"
                value={settings.fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="font-slider"
              />
            </div>
          </div>
          <div
            className="settings-item clickable"
            onClick={() => setShowThemeDialog(true)}
          >
            <div className="item-icon">🎨</div>
            <div className="item-content">
              <div className="item-label">テーマ</div>
              <div className="item-value">{themeLabel[settings.theme]}</div>
            </div>
            <div className="item-arrow">›</div>
          </div>
        </div>

        {/* ストレージ情報 */}
        <div className="settings-section">
          <h2 className="section-title">ストレージ情報</h2>
          <div className="settings-item">
            <div className="item-icon">💾</div>
            <div className="item-content">
              <div className="item-label">ストレージ方式</div>
              <div className="item-value">Tauri Store Plugin</div>
            </div>
          </div>
          <div className="settings-item">
            <div className="item-icon">ℹ️</div>
            <div className="item-content">
              <div className="item-label">保存されている値</div>
              <div className="item-value storage-info">
                notifications: {String(settings.notificationsEnabled)}
                <br />
                username: {settings.username || "(空)"}
                <br />
                fontSize: {settings.fontSize}
                <br />
                theme: {settings.theme}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ユーザー名ダイアログ */}
      {showUsernameDialog && (
        <div className="dialog-overlay" onClick={() => setShowUsernameDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>ユーザー名</h3>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="ユーザー名を入力"
              className="dialog-input"
            />
            <div className="dialog-buttons">
              <button onClick={() => setShowUsernameDialog(false)} className="dialog-btn cancel">
                キャンセル
              </button>
              <button onClick={handleUsernameSubmit} className="dialog-btn confirm">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* テーマダイアログ */}
      {showThemeDialog && (
        <div className="dialog-overlay" onClick={() => setShowThemeDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>テーマ選択</h3>
            <div className="theme-options">
              <button
                className={`theme-option ${settings.theme === "system" ? "active" : ""}`}
                onClick={() => handleThemeChange("system")}
              >
                🌗 システム設定に従う
              </button>
              <button
                className={`theme-option ${settings.theme === "light" ? "active" : ""}`}
                onClick={() => handleThemeChange("light")}
              >
                ☀️ ライト
              </button>
              <button
                className={`theme-option ${settings.theme === "dark" ? "active" : ""}`}
                onClick={() => handleThemeChange("dark")}
              >
                🌙 ダーク
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
