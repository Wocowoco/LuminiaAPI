import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LuminiaApiService } from '../../services/luminia-api/luminia-api.service';
import { NavbarService } from '../../services/navbar-service/navbar.service';
import { DateFormatterService } from '../../helpers/date-formatter.service';
import { TIMELINE_FALLBACK_CURRENT_YEAR } from '../timeline/timeline.data';

interface ExploreLink {
  label: string;
  route: string;
  icon: string;
  description: string;
}

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HomepageComponent implements OnInit {
  public exploreLinks: ExploreLink[] = [];
  public todayLabel: string = '';
  public currentYear: number = TIMELINE_FALLBACK_CURRENT_YEAR;

  private isLuminariesVisible: boolean = false;
  private isGemstoneExchangeVisible: boolean = false;

  constructor(private luminiaApiService: LuminiaApiService,
              private navbarService: NavbarService,
              private dateFormatterService: DateFormatterService) {
    this.updateExploreLinks();
  }

  ngOnInit(): void {
    this.navbarService.getLuminariesVisibility().subscribe((isLuminariesVisible: boolean) => {
      this.isLuminariesVisible = isLuminariesVisible;
      this.updateExploreLinks();
    });
    this.navbarService.getGemstoneExchangeVisibility().subscribe((isGemstoneExchangeVisible: boolean) => {
      this.isGemstoneExchangeVisible = isGemstoneExchangeVisible;
      this.updateExploreLinks();
    });
    // Without the API the page still works; the timeline falls back to TIMELINE_FALLBACK_CURRENT_YEAR
    this.luminiaApiService.getCurrentDate().subscribe({
      next: currentDate => {
        this.todayLabel = this.dateFormatterService.formatDaynumberToString(currentDate.dayNumber);
        this.currentYear = Math.floor(currentDate.dayNumber / 364);
      },
      error: () => this.todayLabel = '',
    });
  }

  // Infernal Alchemy is only linked from here, not from the navbar
  private updateExploreLinks() {
    this.exploreLinks = [
      { label: 'World Map', route: '/map', icon: 'fa-map-location-dot', description: 'Explore the lands, cities and landmarks of Luminia.' },
      { label: 'Pantheon', route: '/pantheon', icon: 'fa-sun', description: 'Meet the gods and learn their domains.' },
      { label: 'Calendar', route: '/calendar', icon: 'fa-calendar-days', description: 'The in-game date, seasons and festivals.' },
      { label: 'Infernal Alchemy', route: '/infernal-alchemy', icon: 'fa-flask', description: 'The alchemical research tree and its potions.' },
      ...(this.isGemstoneExchangeVisible ? [{ label: 'Gemstone Exchange', route: '/gemstone-exchange', icon: 'fa-gem', description: 'Follow the gemstone prices on the market.' }] : []),
      ...(this.isLuminariesVisible ? [{ label: 'Luminaries', route: '/luminaries', icon: 'fa-wand-sparkles', description: 'Legendary artifacts of the gods.' }] : []),
    ];
  }
}
