import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    constructor() {
    }

    encrypt(message: string) {
        return btoa(message);
    }

    decrypt(ecryptString) {
        return atob(ecryptString);
    }
}