import "./AppTest.css";
import { useCounter } from "./hooks/useCounter";

export const AppTest = () => {
  const { count, increment } = useCounter();

  return (
    <div className="App">
      <header role="banner" className="App-header">
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={increment} title="Increment count">
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
};
