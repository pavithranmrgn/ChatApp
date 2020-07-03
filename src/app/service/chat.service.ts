import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Chat } from '../models/chat';
import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private chatsCollection: AngularFirestoreCollection<Chat>;

    private chats: Observable<Chat[]>;

    constructor(private db: AngularFirestore) {
        this.chatsCollection = db.collection<Chat>('chats');

        this.chats = this.chatsCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
        );
    }

    getChats() {
        return this.chats;
    }

    getChat(id) {
        return this.chatsCollection.doc<Chat>(id).valueChanges();
    }

    getChatList() {
        this.db.collection
    }


    getFilterChatData(senderId, recieverId) {
        // debugger
        var query = firestore().collection('chats');
        // query = query.where('senderId', '==', senderId);
        // query = query.where('recieveId', '==', recieverId);
        // query = query.where('senderId', '==', recieverId);
        // query = query.where('recieveId', '==', senderId);
        return query.get();

        // .where('recieveId', '==', senderId)
        // .where('senderId', '==', recieverId)
        // .where('recieveId', '==', recieverId)
        // );
        // var v = s.snapshotChanges().pipe(
        //     map(actions => {
        //         return actions.map(a => {
        //             const data = a.payload.doc.data();
        //             const id = a.payload.doc.id;
        //             return { id, ...data };
        //         });
        //     })
        // );
        // return v;
    }

    getCombinatedStatus(senderId, recieverId): Observable<any> {
        var s = merge(this.db.collection('chats', ref => ref.where('senderId', 'in', [senderId])).valueChanges(),
            this.db.collection('chats', ref => ref.where('recieveId', 'in', [recieverId])).valueChanges());
        debugger;
        return s;
    }

    updateChat(chat: Chat, id: string) {
        return this.chatsCollection.doc(id).update(chat);
    }

    addChat(chat: Chat) {
        return this.chatsCollection.add(chat);
    }

    removeChat(id) {
        return this.chatsCollection.doc(id).delete();
    }

}