import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
  }

  handleClick() {
    this.onClick.emit();
  }
}
