import { Link } from "@tanstack/react-router";
import { useCounter } from "../contexts/CounterContext";

export default function Counter() {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <div className="page">
      <header className="header">
        <Link to="/" className="back-button">
          ← 戻る
        </Link>
        <h1>Counter</h1>
        <button onClick={reset} className="reset-button">
          リセット
        </button>
      </header>
      <main className="counter-content">
        <p className="counter-label">カウント値</p>
        <p className="counter-value">{count}</p>
        <div className="counter-buttons">
          <button onClick={decrement} className="counter-btn">
            −
          </button>
          <button onClick={increment} className="counter-btn">
            +
          </button>
        </div>
      </main>
    </div>
  );
}
