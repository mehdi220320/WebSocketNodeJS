import { Component,OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  currentUrl: string = '';
  UrlsWithSideBar:string []=['','login','signup'];
  constructor(private route:Router) {
  }
  ngOnInit(){
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }
  WithSideBar(url: string): boolean {
    return this.UrlsWithSideBar.includes(url);
  }
}
