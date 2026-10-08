import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./ui/fonts";
import "./ui/styles.css";
import { initStore, store } from "./ui/state";
import { setupNative } from "./ui/native";
import { App } from "./ui/App";
import { setLang } from "./i18n";
import { listenForReminderTaps, refreshReminders, webReminderOnOpen } from "./ui/reminders";

const root = createRoot(document.getElementById("root")!);
initStore().then(() => {
  setLang(store.state.preferences.language);
  void setupNative(() => {
    void store.flush();
    void refreshReminders(store.state).catch(() => undefined);
  });
  void listenForReminderTaps().catch(() => undefined);
  void refreshReminders(store.state).catch(() => undefined);
  webReminderOnOpen(store.state);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
