import type { CapacitorConfig } from '@capacitor/cli';
import { interval } from 'rxjs';

const config: CapacitorConfig = {
    appId: 'com.zelo.app',
    appName: 'zelo-paginas',
    webDir: 'www',
    android: {
        useLegacyBridge: true
    },
};

export default config;
