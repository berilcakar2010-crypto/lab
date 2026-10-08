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

/** Save a binary file (recording, image): download on the web, the Android share sheet in the app. */
export async function saveBlobFile(name: string, blob: Blob) {
  if (!isNative()) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    return;
  }
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
  const [{ Filesystem, Directory }, { Share }] = await Promise.all([import("@capacitor/filesystem"), import("@capacitor/share")]);
  const res = await Filesystem.writeFile({ path: name, data: dataUrl.split(",")[1] ?? "", directory: Directory.Cache });
  await Share.share({ title: name, files: [res.uri], dialogTitle: L("Save or share the file", "Dosyayı kaydet veya paylaş") });
}

/** Read text aloud with the platform voice, if there is one. */
export function speak(text: string, lang: "en" | "tr"): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "tr" ? "tr-TR" : "en-GB";
  u.rate = 0.98;
  window.speechSynthesis.speak(u);
  return true;
}

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;
export const stopSpeaking = () => canSpeak() && window.speechSynthesis.cancel();
