import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'luminary-button',
  templateUrl: './luminary-button.component.html',
  styleUrls: ['./luminary-button.component.css']
})
export class LuminaryButtonComponent implements OnInit {

  constructor() { }

  @Input() iconName: string = 'unknown';
  @Input() title: string = 'Unknown';
  @Input() subTitle: string = '';
  @Input() disabled: boolean = false;

  ngOnInit(): void {
  }


}
