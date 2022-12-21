import React from "react";
import ReactDOM from "react-dom/client";
import { Header } from "./components/header/Header";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Header />
  </React.StrictMode>
);
