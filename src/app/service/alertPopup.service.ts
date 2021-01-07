import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AlertPopupService {

    constructor(private alertCtrl: AlertController) {
    }

    async contactPermissionAlert(permission, callbackFun, that) {
        var alert = await this.alertCtrl.create({
            message: 'Contact access is mandatory to continue use of the app, can you retry or exit ?',
            buttons: [
                {
                    text: 'Exit',
                    role: 'cancel'
                },
                {
                    text: 'Retry',
                    handler: () => {
                        callbackFun(permission, that);
                    }
                }
            ]
        });

        alert.present();
    }

}