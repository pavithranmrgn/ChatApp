import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/service/store.service';
import { ChatService } from 'src/app/service/chat.service';
import { UserService } from 'src/app/service/user.service';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Location } from '@angular/common';
import { IonContent } from '@ionic/angular';
import { EncryptionService } from 'src/app/service/excryption.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent)
  content: IonContent;

  selectedUserId: string = '';
  currentUserId: string = '';

  message: string = '';

  allMessages: any = [];
  userDetails: User;

  chatSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private store: Store,
    private location: Location,
    private encryptionService: EncryptionService
  ) {
    this.currentUserId = store.userUID;
    this.route.params.subscribe(params => {
      this.selectedUserId = params['id'];
    });
  }

  ngOnInit() {
    this.getUserDetails();
    this.getChats();
  }

  updateScroll() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(100);
      }
    }, 500);
  }

  goBack() {
    this.location.back();
  }

  async getUserDetails() {
    var userObservable = this.userService.getUserWithUID(this.selectedUserId).subscribe(res => {
      this.userDetails = res[0];
      userObservable.unsubscribe();
    });
  }

  getDecrytMessage(message) {
    return this.encryptionService.decrypt(message);
  }

  async getChats() {
    this.chatSubscription = this.chatService.getUserMessages(this.currentUserId, this.selectedUserId).subscribe(res => {
      this.allMessages = res;
      this.updateScroll();
    });
  }

  async sendMessage() {
    if (this.message) {
      this.chatService.addChat({
        senderId: this.store.userUID,
        recieveBy: this.selectedUserId,
        message: this.encryptionService.encrypt(this.message),
        createdDate: new Date()
      });
      this.message = '';
    }
  }

  ngOnDestroy() {
    this.chatSubscription.unsubscribe();
  }

}
