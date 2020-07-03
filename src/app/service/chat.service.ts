import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Chat } from '../models/chat';
import { Observable, merge, combineLatest } from 'rxjs';
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

    getUserMessages(senderId, recieverId): Observable<Chat[]> {
        return combineLatest(
            this.db.collection('chats', ref => ref.where('senderId', '==', senderId).where('recieveBy', '==', recieverId)).valueChanges(),
            this.db.collection('chats', ref => ref.where('senderId', '==', recieverId).where('recieveBy', '==', senderId)).valueChanges()
        ).pipe(
            map(([senderChat, recieverChat]) => {
                return [].concat(senderChat, recieverChat).sort((a, b) => a.createdDate.toDate() - b.createdDate.toDate());
            })
        );
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