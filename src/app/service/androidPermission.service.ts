import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AlertPopupService } from './alertPopup.service';

@Injectable({
    providedIn: 'root'
})
export class AndroidPermissionService {

    constructor(
        private diagnostic: Diagnostic,
        private alertService: AlertPopupService
    ) { }

    checkAndAskPermissions(permissions) {
        var permissionString = this.getPermissionString(permissions);
        this.diagnostic.getPermissionAuthorizationStatus(permissionString).then(
            result => {
                this.checkStatusAndRequest(result, permissionString);
            },
            err => {
                this.requestPermission(permissionString, this);
            }
        );
    }

    requestPermission(permissionString, that) {
        that.diagnostic.requestRuntimePermission(permissionString).then(
            result => {
                that.checkStatusAndRequest(result, permissionString, true);
            },
            reject => {
                console.log(reject)
            }
        );
    }

    getPermissionString(permissions) {
        var returnStr;
        switch (permissions) {
            case 'Contacts':
                returnStr = this.diagnostic.permission.READ_CONTACTS;
                break;
        }
        return returnStr;
    }

    checkStatusAndRequest(status, permissions, isUserDenied = false) {
        switch (status) {
            case this.diagnostic.permissionStatus.NOT_REQUESTED:
                this.requestPermission(permissions, this);
                break;
            case this.diagnostic.permissionStatus.DENIED_ONCE:
                if (isUserDenied) {
                    this.alertService.contactPermissionAlert(permissions, this.requestPermission, this);
                }
                else {
                    this.requestPermission(permissions, this);
                }
                break;
            case this.diagnostic.permissionStatus.GRANTED:
                break;
            case this.diagnostic.permissionStatus.DENIED_ALWAYS:
                break;
        }
    }

}