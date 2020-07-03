import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginModuleGuard } from './login/login.module.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: "./login/login.module#LoginPageModule",
    canActivate: [LoginModuleGuard]
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'chat/:id',
    loadChildren: './chat/chat.module#ChatPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [LoginModuleGuard],
  exports: [RouterModule]
})
export class PagesModule { }
