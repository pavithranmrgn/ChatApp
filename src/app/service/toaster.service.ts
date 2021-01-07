import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {

    constructor(private toasterCtrl: ToastController) {
    }

    async presentToater(msg) {
        var toaster = await this.toasterCtrl.create({
            message: msg,
            duration: 3000
        });

        toaster.present();
    }
}