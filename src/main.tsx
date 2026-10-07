import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./ui/styles.css";
import { initStore } from "./ui/state";
import { App } from "./ui/App";

const root = createRoot(document.getElementById("root")!);
initStore().then(() =>
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  ),
);
