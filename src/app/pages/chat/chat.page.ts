import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/service/store.service';
import { ChatService } from 'src/app/service/chat.service';
import { UserService } from 'src/app/service/user.service';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  selectedUserId: string = '';
  currentUserId: string = '';

  message: string = '';

  allMessages: any = [];
  userDetails: User;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private store: Store,
    private location: Location
  ) {
    this.currentUserId = store.userUID;
    this.route.params.subscribe(params => {
      this.selectedUserId = params['id'];
    });
  }

  ngOnInit() {
    this.getUserDetails();
    this.getUserMessage();
  }

  goBack(){
    this.location.back();
  }

  async getUserDetails() {
    var userObservable = this.userService.getUserWithUID(this.selectedUserId).subscribe(res => {
      this.userDetails = res[0];
      userObservable.unsubscribe();
    });
  }

  async getUserMessage() {
    // this.chatService.getFilterChatData(this.currentUserId, this.selectedUserId).subscribe(res => {
    //   res;
    //   debugger
    // });
  }

  async sendMessage() {
    this.chatService.addChat({
      senderId: this.store.userUID,
      recieveBy: this.selectedUserId,
      message: this.message,
      createdDate: new Date()
    });
  }

}
