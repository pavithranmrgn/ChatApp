import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Store {
    constructor() {
    }

    get userUID() {
        return localStorage.getItem('uid');
    }

    set userUID(value){
        localStorage.setItem('uid', value);
    }
}