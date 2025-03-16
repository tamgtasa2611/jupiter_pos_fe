import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tamnd.app',
  appName: 'NPP AS',
  webDir: 'public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
