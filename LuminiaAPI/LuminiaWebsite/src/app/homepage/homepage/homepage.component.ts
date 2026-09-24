import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HomepageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
