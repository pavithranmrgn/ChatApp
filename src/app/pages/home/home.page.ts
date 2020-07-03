import { Component } from '@angular/core';
import { Store } from 'src/app/service/store.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public usersList: any = [];
  public loggedUserId: string = this.store.userUID;
  constructor(
    private store: Store,
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getAllUsers();
  }

  async getAllUsers() {
    this.userService.getUsers().subscribe(res => {
      this.usersList = res;
      this.usersList = this.usersList.filter(a => a.uid !== this.loggedUserId);
    });
  }

  async navigateToChat(id) {
    this.router.navigate(['/chat', id]);
  }

}
