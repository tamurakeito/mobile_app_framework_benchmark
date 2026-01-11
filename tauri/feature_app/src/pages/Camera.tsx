import { Link } from "@tanstack/react-router";
import { useState, useRef } from "react";

export default function Camera() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setImage(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="page">
      <header className="header">
        <Link to="/" className="back-button">
          ← 戻る
        </Link>
        <h1>Camera</h1>
        {image && (
          <button onClick={handleDelete} className="reset-button">
            削除
          </button>
        )}
      </header>

      <main className="camera-content">
        <div className="image-area">
          {image ? (
            <img src={image} alt="Captured" className="preview-image" />
          ) : (
            <div className="empty-state">
              <span className="camera-icon">📷</span>
              <p>画像を選択してください</p>
            </div>
          )}
        </div>

        <div className="camera-buttons">
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="camera-input"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-input"
          />
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="camera-btn"
          >
            📷 カメラ
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="camera-btn"
          >
            🖼️ ギャラリー
          </button>
        </div>

        {fileName && <p className="file-name">ファイル: {fileName}</p>}
      </main>
    </div>
  );
}
