import { Component } from '@angular/core';
import { Store } from 'src/app/service/store.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { MenuController, Platform } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts/ngx';
import { AndroidPermissionService } from 'src/app/service/androidPermission.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public usersList: any = [];
  public options: any;
  public allContacts: any = [];
  public phoneNumberArray = [];

  public loggedUserId: string = this.store.userUID;

  private userListSubscribe: Subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private userService: UserService,
    private menuCtrl: MenuController,
    private androidPermissionService: AndroidPermissionService,
    private deviceContact: Contacts,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
    this.checkAndAskPermission();
  }

  checkAndAskPermission() {
    this.androidPermissionService.checkAndAskPermissions('Contacts');
    this.getDeviceContacts();
  }

  async getDeviceContacts() {
    if (this.platform.is('cordova')) {
      await this.deviceContact.find(['displayName', 'phoneNumbers'], { filter: "", multiple: true })
        .then(data => {
          this.initializeAndFormContact(data);
        });
    }
  }

  initializeAndFormContact(contacts) {
    for (var i = 0; i < contacts.length; i++) {
      var contact = contacts[i];

      var otherNumber = contact.phoneNumbers;

      while (otherNumber && otherNumber.length > 0) {
        var phoneNumber = (otherNumber[0].value).replace(/\D/g, '');
        this.allContacts.push({
          displayName: contact.displayName,
          phoneNumber: phoneNumber
        });
        this.phoneNumberArray.push(phoneNumber);
        otherNumber = otherNumber.filter(a => !(a.value).replace(/\D/g, '').includes(phoneNumber));
      }
    }

    this.getAllUsers();
  }

  ionViewWillEnter() {
    if (this.phoneNumberArray.length > 0 || !this.platform.is('cordova')) {
      this.getAllUsers();
    }
  }

  async getAllUsers() {
    if (this.userListSubscribe) {
      this.userListSubscribe.unsubscribe();
    }
    if (!this.platform.is('cordova')) {
      this.userListSubscribe = this.userService.getUsers().subscribe(res => {
        this.usersList = res;
      });
    }
    else {
      this.userListSubscribe = this.userService.getAddressBookContactsOnly(this.phoneNumberArray).subscribe(res => {
        this.usersList = res;
      });
    }
  }

  getDisplayName(user) {
    user.displayName = this.allContacts.length > 0 ? this.allContacts.find(a => a.phoneNumber == user.phone).displayName : user.phone;
    return user.displayName;
  }

  async navigateToChat(user, id) {
    this.router.navigate(['/chat', id], { state: { data: { user } } });
  }

  ngOnDestroy() {
    this.userListSubscribe.unsubscribe();
  }

}
