import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {TaskComponent} from './task/task.component';

const routes: Routes = [
  {path:'chat/:name',component:ChatComponent},
  {path:'task/:name',component:TaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
