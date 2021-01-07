import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    private secretKey: string = 'secret key 746315924756293078SDPLNSDFK9UJHNVBN456265235';

    constructor() {
    }

    encrypt(message: string) {
        var ciphertext = CryptoJS.AES.encrypt(message, this.secretKey).toString();
        return ciphertext;
    }

    decrypt(ecryptString) {
        var bytes = CryptoJS.AES.decrypt(ecryptString, this.secretKey);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }
}