import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public menuLists: any = [];

  constructor() {
  }

  ngOnInit() { 
    this.initializeSideMenu();
  }

  initializeSideMenu() {
    this.menuLists = [
      {
        name: 'Home',
        routeUrl: '/home',
        icon: 'home'
      },
      {
        name: 'Settings',
        routeUrl: '/settings',
        icon: 'settings'
      }
    ];
  }



}
