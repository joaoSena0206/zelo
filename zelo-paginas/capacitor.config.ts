import type { CapacitorConfig } from '@capacitor/cli';
import { interval } from 'rxjs';

const config: CapacitorConfig = {
    appId: 'io.ionic.starter',
    appName: 'zelo-paginas',
    webDir: 'www',
    plugins: {
        BackgroundRunner: {
            label: 'io.ionic.starter.localizacao',
            src: 'runners/runner.js',
            event: 'pegarLoc',
            repeat: true,
            interval: 1,
            autoStart: true
        }
    }
};

export default config;
