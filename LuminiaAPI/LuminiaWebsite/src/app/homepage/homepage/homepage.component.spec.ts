import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { HomepageComponent } from './homepage.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { TimelineCardComponent } from '../timeline/timeline-card/timeline-card.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageComponent, TimelineComponent, TimelineCardComponent ],
      providers: [ provideHttpClient(), provideHttpClientTesting(), provideRouter([]) ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link to Infernal Alchemy', () => {
    expect(component.exploreLinks.some(link => link.route === '/infernal-alchemy')).toBeTrue();
  });
});
