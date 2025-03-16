import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tamnd.app",
  appName: "NPP AS",
  webDir: "out", // CHANGE THIS FROM "public" to "out"
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
    BarcodeScanning: {
      // The following configures the behavior of the camera during barcode scanning
      cameraPermissionText: "Vui lòng cho phép ứng dụng truy cập camera để quét mã vạch",
      detectorMinDistanceToRefocus: 0.5, // in meters
    },
    SplashScreen: {
      launchShowDuration: 2000,
    },
  },
};

export default config;
