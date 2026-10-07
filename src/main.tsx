import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./ui/fonts";
import "./ui/styles.css";
import { initStore, store } from "./ui/state";
import { setupNative } from "./ui/native";
import { App } from "./ui/App";
import { setLang } from "./i18n";

const root = createRoot(document.getElementById("root")!);
initStore().then(() => {
  setLang(store.state.preferences.language);
  void setupNative(() => void store.flush());
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
