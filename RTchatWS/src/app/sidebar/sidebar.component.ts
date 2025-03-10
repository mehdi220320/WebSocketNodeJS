import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';
import { createPopper, Instance } from '@popperjs/core';
import {SocketIOService} from '../services/SocketIO.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  currentUrl: string = '';
  userRole: string | null = null;
  userId: string | null = null;
  newTaskNotification: boolean = false;
  UrlsWithSideBar:string []=['/','/login','/signup'];
  constructor(private route:Router,private el: ElementRef, private renderer: Renderer2 ,     private socketService: SocketIOService) {
  }
  ngOnInit(){
    this.userRole = localStorage.getItem('userRole');
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        console.log("the current url is : "+this.currentUrl)

      }
    });
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.socketService.getTaskUpdatesForUser(this.userId).subscribe((task) => {
        this.newTaskNotification = true;
        console.log(this.newTaskNotification);
      });
    }

    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });

  }
  WithSideBar(url: string): boolean {
    return this.UrlsWithSideBar.includes(url);
  }

  clearNotification() {
    this.newTaskNotification = false;
  }
  private poppers: Instance[] = [];
  private readonly animationDuration = 300;
  sidebarEl: HTMLElement | null = null;
  layoutEL:HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.sidebarEl = this.el.nativeElement.querySelector('#sidebar');
    this.layoutEL = this.el.nativeElement.querySelector('.layout'); // Récupérer l'élément layout
    this.initPoppers();
    this.setupEventListeners();
  }
  private initPoppers(): void {
    const subMenus = this.el.nativeElement.querySelectorAll('.menu-item.sub-menu');
    subMenus.forEach((menu: HTMLElement) => {
      const reference = menu.querySelector('a');
      const popperTarget = menu.lastElementChild as HTMLElement;
      if (reference && popperTarget) {
        this.poppers.push(createPopper(reference, popperTarget, {
          placement: 'right',
          modifiers: [{ name: 'computeStyles', options: { adaptive: false } }]
        }));
      }
    });
  }

  private setupEventListeners(): void {
    const collapseBtn = this.el.nativeElement.querySelector('#btn-collapse');
    if (collapseBtn) {
      this.renderer.listen(collapseBtn, 'click', () => this.toggleSidebar());
    }
  }

  private toggleSidebar(): void {
    if (this.sidebarEl && this.layoutEL) {
      const isCollapsed = this.sidebarEl.classList.toggle('collapsed');
      this.sidebarEl.style.width = isCollapsed ? '80px' : '280px';
      this.layoutEL.style.width = isCollapsed ? '118%' : '100%';
      this.closeAllPoppers();
    }
  }


  private closeAllPoppers(): void {
    this.poppers.forEach(popper => {
      (popper.state.elements.popper as HTMLElement).style.visibility = 'hidden';
    });
  }

  toggleSubMenu(target: HTMLElement): void {
    const isVisible = window.getComputedStyle(target).display !== 'none';
    isVisible ? this.slideUp(target) : this.slideDown(target);
  }

  private slideUp(target: HTMLElement): void {
    target.style.transition = `height ${this.animationDuration}ms ease`;
    target.style.height = '0px';
    setTimeout(() => target.style.display = 'none', this.animationDuration);
  }

  private slideDown(target: HTMLElement): void {
    target.style.display = 'block';
    const height = target.scrollHeight + 'px';
    target.style.height = '0px';
    setTimeout(() => target.style.height = height, 10);
  }
}
