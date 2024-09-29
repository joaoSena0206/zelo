import { Geolocation } from '@capacitor/geolocation';
import { BackgroundRunner } from '@capacitor/background-runner';

addEventListener("pegarLoc", async (resolve, reject, args) => {
    try {
        const coords = await Geolocation.getCurrentPosition();

        console.log(coords);
        resolve();
    }   
    catch (erro) {
        console.error(erro);
        reject(erro);
    }
});