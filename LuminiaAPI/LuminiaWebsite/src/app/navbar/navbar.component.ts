import { Component, HostListener, OnInit } from '@angular/core';
import { VersionService } from '../services/version-service/version.service';
import { NavbarService } from '../services/navbar-service/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isMobileView : boolean = false;
  public isMenuOpen : boolean = false;
  public version: string = "0.0.0";
  public isLuminariesVisible: boolean = false;
  public isGemstoneExchangeVisible: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any)
  {
    this.isMobileView = window.innerWidth < 875;

    //Close menu if no longer on mobile view
    if(!this.isMobileView){
      this.isMenuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    //If not clicked on menu, close menu
    const target = event.target as HTMLElement;
    const isMenuClicked = target.classList.contains('mobile-menu') || target.classList.contains('filterIcon') ||target.classList.contains('hamburger-button');

    if (!isMenuClicked) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    this.isMenuOpen = false;
  }

  constructor(private versionService: VersionService, private navbarService: NavbarService) {
    this.onResize(null);
    this.versionService.getVersion().subscribe((version: string) => {
      this.version = version;
    });
    this.navbarService.getLuminariesVisibility().subscribe((isLuminariesVisible: boolean) => {
      this.isLuminariesVisible = isLuminariesVisible;
    });
    this.navbarService.getGemstoneExchangeVisibility().subscribe((isGemstoneExchangeVisible: boolean) => {
      this.isGemstoneExchangeVisible = isGemstoneExchangeVisible;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  ngOnInit(): void {
  }

}
