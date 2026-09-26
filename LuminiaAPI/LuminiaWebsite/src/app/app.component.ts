import { Component, ChangeDetectionStrategy, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnDestroy {
  title = 'Luminia';

  // Pages scroll inside .content, not the window, so the router's own scroll restoration doesn't reach it
  @ViewChild('content', { static: true }) private content!: ElementRef<HTMLElement>;
  private routerSubscription: Subscription;

  constructor(private router: Router) {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.content.nativeElement.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
