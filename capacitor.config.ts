import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tamnd.app",
  appName: "NPP AS",
  webDir: "out",  // CHANGE THIS FROM "public" to "out"
  server: {
    androidScheme: "https",
    cleartext: true, 
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
  },
  loggingBehavior: "debug",
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000
    }
  }
};

export default config;