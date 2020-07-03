import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable, merge } from 'rxjs';
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

    async checkAndRegisterUser(user: User, uid: string) {
        var ifAlreadyExsist = await this.db.collection('users', ref => ref.where('uid', '==', uid))
            .get().toPromise();
            // .pipe(first())
            // .toPromise();

        if (ifAlreadyExsist.empty) {
            this.addUser(user);
        }
    }

    getUserWithUID(uid: string){
        return this.db.collection<User>('users', ref => ref.where('uid', '==', uid)).valueChanges();
    }

    addUser(user: User) {
        return this.usersCollection.add(user);
    }

    removeUser(id) {
        return this.usersCollection.doc(id).delete();
    }

}