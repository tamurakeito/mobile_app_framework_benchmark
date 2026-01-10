import { Link } from "@tanstack/react-router";

export default function Camera() {
  return (
    <div className="page">
      <header className="header">
        <Link to="/" className="back-button">
          ← 戻る
        </Link>
        <h1>Camera</h1>
      </header>
      <main className="placeholder-content">
        <span className="placeholder-icon">📷</span>
        <h2>カメラ機能</h2>
        <p>Phase 3 で実装予定</p>
      </main>
    </div>
  );
}
