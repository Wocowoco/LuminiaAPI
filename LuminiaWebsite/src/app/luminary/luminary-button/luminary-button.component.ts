import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'luminary-button',
  templateUrl: './luminary-button.component.html',
  styleUrls: ['./luminary-button.component.css']
})
export class LuminaryButtonComponent implements OnInit {

  constructor() { }

  @Input() iconName: string = 'unknown';
  @Input() name: string = 'Unknown';
  @Input() subTitle: string = '';
  @Input() disabled: boolean = false;
  @Input() visible: boolean = false;

  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  public displayIconName: string = 'unknown';
  public displayName: string = 'Unknown';
  public displaySubTitle: string = '';

  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log('ngOnChanges', this.iconName, this.name, this.subTitle, this.disabled, this.visible);
    if (this.visible === false) {
      this.displayIconName = 'unknown';
      this.displayName = 'Unknown';
      this.displaySubTitle = '';
    }
    else {
      this.displayIconName = this.iconName;
      this.displayName = this.name;
      this.displaySubTitle = this.subTitle;
    }

  }

  handleClick() {
    this.onClick.emit();
  }
}
