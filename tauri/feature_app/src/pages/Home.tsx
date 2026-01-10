import { Link } from "@tanstack/react-router";

const menuItems = [
  {
    path: "/counter",
    title: "Counter",
    subtitle: "状態管理の検証",
    icon: "➕",
  },
  {
    path: "/api",
    title: "API",
    subtitle: "REST API通信の検証",
    icon: "☁️",
  },
  {
    path: "/camera",
    title: "Camera",
    subtitle: "カメラ撮影機能",
    icon: "📷",
  },
  {
    path: "/notifications",
    title: "Notifications",
    subtitle: "プッシュ通知のテスト",
    icon: "🔔",
  },
  {
    path: "/settings",
    title: "Settings",
    subtitle: "テーマ切り替え",
    icon: "⚙️",
  },
];

export default function Home() {
  return (
    <div className="page">
      <header className="header">
        <h1>Feature App</h1>
      </header>
      <main className="menu-list">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className="menu-card">
            <span className="menu-icon">{item.icon}</span>
            <div className="menu-content">
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
            </div>
            <span className="menu-arrow">›</span>
          </Link>
        ))}
      </main>
    </div>
  );
}
