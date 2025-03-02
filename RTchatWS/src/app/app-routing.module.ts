import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {TaskComponent} from './task/task.component';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {LandpageComponent} from './landpage/landpage.component';
import {ProjectsComponent} from './projects/projects.component';

const routes: Routes = [
  {path:'chat/:name/:id',component:ChatComponent},
  {path:'task/:name/:id',component:TaskComponent},
  {path:'signup',component:SignupComponent},
  {path:'login',component:LoginComponent},
  {path:'',component:LandpageComponent},
  {path:'projects',component:ProjectsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
