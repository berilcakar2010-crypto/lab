/**
 * Android (Capacitor) integration. Everything here is a no-op in a normal
 * browser, so the web build keeps working unchanged.
 */
import { Capacitor } from "@capacitor/core";
import { L } from "../i18n";

export const isNative = () => Capacitor.isNativePlatform();

export async function setupNative(onPause: () => void) {
  if (!isNative()) return;
  const [{ App }, { StatusBar, Style }] = await Promise.all([import("@capacitor/app"), import("@capacitor/status-bar")]);
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#150a0d" });
  } catch {
    /* not critical */
  }
  // Hardware back: close an open sheet, else go back, else leave the app from Home.
  App.addListener("backButton", () => {
    if (document.querySelector(".sheet-backdrop")) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      return;
    }
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && hash !== "/") window.history.back();
    else void App.exitApp();
  });
  // WebViews don't reliably fire pagehide; persist when the app goes to the background.
  App.addListener("pause", onPause);
}

/** Save a text file: download on the web, the Android share sheet in the app. */
export async function saveTextFile(name: string, text: string, mime: string) {
  if (!isNative()) {
    const blob = new Blob([text], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
    return;
  }
  const [{ Filesystem, Directory, Encoding }, { Share }] = await Promise.all([import("@capacitor/filesystem"), import("@capacitor/share")]);
  const res = await Filesystem.writeFile({ path: name, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 });
  await Share.share({ title: name, files: [res.uri], dialogTitle: L("Save or share the file", "Dosyayı kaydet veya paylaş") });
}
