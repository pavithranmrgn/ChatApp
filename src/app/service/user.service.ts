import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private usersCollection: AngularFirestoreCollection<User>;

    private users: Observable<User[]>;

    constructor(private db: AngularFirestore) {
        this.usersCollection = db.collection<User>('users');

        this.users = this.usersCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );
    }

    getUsers() {
        return this.users;
    }

    getUser(id) {
        return this.usersCollection.doc<User>(id).valueChanges();
    }

    updateUser(user: User, id: string) {
        return this.usersCollection.doc(id).update(user);
    }

    getAddressBookContactsOnly(phoneNumbers) {
        var loopLength = Math.ceil(phoneNumbers.length / 10);
        var splitedArray = [];
        for (var i = 0; i < loopLength; i++) {
            var data = phoneNumbers.splice(0, 10);
            splitedArray.push(data);
        }

        const observables = splitedArray.map(
            number => (this.db.collection('users', ref => ref.where('phone', 'in', number)).valueChanges())
        );

        return combineLatest(observables).pipe(
            map((res) => {
                var returnObj = [];
                res.map(a => { returnObj = returnObj.concat(a) });
                return returnObj;
            })
        );
    }

    async checkAndRegisterUser(user: User, uid: string) {
        var ifAlreadyExsist = await this.db.collection('users', ref => ref.where('uid', '==', uid))
            .get().toPromise();
        // .pipe(first())
        // .toPromise();

        if (ifAlreadyExsist.empty) {
            this.addUser(user);
        }
    }

    getUserWithUID(uid: string) {
        return this.db.collection<User>('users', ref => ref.where('uid', '==', uid)).valueChanges();
    }

    addUser(user: User) {
        return this.usersCollection.add(user);
    }

    removeUser(id) {
        return this.usersCollection.doc(id).delete();
    }

}