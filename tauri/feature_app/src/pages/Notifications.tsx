import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export default function Notifications() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [status, setStatus] = useState("初期化中...");

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      let granted = await isPermissionGranted();
      if (!granted) {
        const permission = await requestPermission();
        granted = permission === "granted";
      }
      setPermissionGranted(granted);
      setStatus(granted ? "準備完了" : "権限が拒否されました");
    } catch (error) {
      setPermissionGranted(false);
      setStatus(`エラー: ${error}`);
    }
  };

  const handleSendNotification = async () => {
    if (!permissionGranted) {
      alert("通知の権限がありません");
      return;
    }

    try {
      const now = new Date().toLocaleTimeString("ja-JP");
      sendNotification({
        title: "テスト通知",
        body: `これはTauriからの通知です！ ${now}`,
      });
    } catch (error) {
      alert(`通知の送信に失敗しました: ${error}`);
    }
  };

  const handleScheduleNotification = async () => {
    if (!permissionGranted) {
      alert("通知の権限がありません");
      return;
    }

    // 5秒後に通知を送信
    setTimeout(() => {
      sendNotification({
        title: "スケジュール通知",
        body: "5秒後に届く通知です！",
      });
    }, 5000);

    alert("5秒後に通知が届きます");
  };

  return (
    <div className="page">
      <header className="header">
        <Link to="/" className="back-button">
          ← 戻る
        </Link>
        <h1>Notifications</h1>
      </header>

      <main className="notifications-content">
        {/* ステータス表示 */}
        <div className="status-card">
          <span
            className={`status-icon ${permissionGranted ? "granted" : "pending"}`}
          >
            {permissionGranted === null
              ? "⏳"
              : permissionGranted
                ? "✓"
                : "✗"}
          </span>
          <span className="status-text">ステータス: {status}</span>
        </div>

        {/* ボタンエリア */}
        <div className="notification-buttons">
          <button
            onClick={handleSendNotification}
            disabled={!permissionGranted}
            className="notification-btn primary"
          >
            🔔 今すぐ通知を送信
          </button>
          <button
            onClick={handleScheduleNotification}
            disabled={!permissionGranted}
            className="notification-btn secondary"
          >
            ⏰ 5秒後に通知を送信
          </button>
        </div>

        {/* 説明カード */}
        <div className="info-card">
          <h2>通知機能について</h2>
          <ul>
            <li>ローカル通知の送信</li>
            <li>スケジュール通知</li>
            <li>通知タップ時のコールバック</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
