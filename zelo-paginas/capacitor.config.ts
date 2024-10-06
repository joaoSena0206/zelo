import type { CapacitorConfig } from '@capacitor/cli';
import { interval } from 'rxjs';

const config: CapacitorConfig = {
    appId: 'com.zelo.app',
    appName: 'zelo-paginas',
    webDir: 'www',
    android: {
        useLegacyBridge: true
    },
    server: {
        url: "192.168.0.242:8100",
        cleartext: true
    }
};

export default config;
