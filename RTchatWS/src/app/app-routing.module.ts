import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {TaskComponent} from './task/task.component';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path:'chat/:name',component:ChatComponent},
  {path:'task/:name',component:TaskComponent},
  {path:'signup',component:SignupComponent},
  {path:'login',component:LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
