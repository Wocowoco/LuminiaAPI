import { Component, HostListener, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { VersionService } from '../services/version-service/version.service';
import { NavbarService } from '../services/navbar-service/navbar.service';

interface NavLink {
  label: string;
  route: string;
  icon: string;
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavbarComponent implements OnDestroy {
  public isMenuOpen: boolean = false;
  public version: string = "0.0.0";
  public navLinks: NavLink[] = [];

  private isLuminariesVisible: boolean = false;
  private isGemstoneExchangeVisible: boolean = false;
  private routerSubscription: Subscription;

  constructor(private versionService: VersionService, private navbarService: NavbarService, private router: Router) {
    this.updateNavLinks();
    this.versionService.getVersion().subscribe((version: string) => {
      this.version = version;
    });
    this.navbarService.getLuminariesVisibility().subscribe((isLuminariesVisible: boolean) => {
      this.isLuminariesVisible = isLuminariesVisible;
      this.updateNavLinks();
    });
    this.navbarService.getGemstoneExchangeVisibility().subscribe((isGemstoneExchangeVisible: boolean) => {
      this.isGemstoneExchangeVisible = isGemstoneExchangeVisible;
      this.updateNavLinks();
    });

    //Close the mobile menu once a link has been followed
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private updateNavLinks() {
    this.navLinks = [
      { label: 'Calendar', route: '/calendar', icon: 'fa-calendar-days' },
      ...(this.isGemstoneExchangeVisible ? [{ label: 'Gemstone Exchange', route: '/gemstone-exchange', icon: 'fa-gem' }] : []),
      ...(this.isLuminariesVisible ? [{ label: 'Luminaries', route: '/luminaries', icon: 'fa-wand-sparkles' }] : []),
      { label: 'Pantheon', route: '/pantheon', icon: 'fa-sun' },
      { label: 'World Map', route: '/map', icon: 'fa-map-location-dot' },
    ];
  }
}
