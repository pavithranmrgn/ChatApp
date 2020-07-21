import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		IonicModule,
	],
	exports: [MenuComponent],
	providers:[MenuComponent],
	declarations: [MenuComponent]
})
export class MenuModule {}
