import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {RouterModule} from '@angular/router';
import { LandpageComponent } from './landpage/landpage.component';
import { ProjectsComponent } from './projects/projects.component';
import { SidebarComponent } from './sidebar/sidebar.component';
@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    SignupComponent,
    LoginComponent,
    LandpageComponent,
    ProjectsComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([]) // Initialize the router
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
