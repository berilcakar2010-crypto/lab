import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.berilcakar.lab",
  appName: "Lab",
  webDir: "dist",
  backgroundColor: "#150a0d",
  android: {
    // Gemini/Groq are called over HTTPS from the WebView; no cleartext needed.
    allowMixedContent: false,
  },
  plugins: {
    StatusBar: { backgroundColor: "#150a0d", style: "DARK", overlaysWebView: false },
  },
};

export default config;
