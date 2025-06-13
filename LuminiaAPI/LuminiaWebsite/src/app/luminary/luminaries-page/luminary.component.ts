import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LuminaryService } from 'src/app/services/luminary-service/luminary.service';
import { LuminaryVisibility } from '../luminary-visibility.enum';

@Component({
  selector: 'app-luminary',
  templateUrl: './luminary.component.html',
  styleUrls: ['./luminary.component.css'],
})
export class LuminaryComponent implements OnInit {

  public isSwirlingMoonVisible: boolean = false;
  public isSwirlingMoonDisabled: boolean = true;

  public isSunKhopeshVisible: boolean = false;
  public isSunKhopeshDisabled: boolean = true;
  constructor(private router: Router, private luminaryService: LuminaryService) { }

  ngOnInit(): void {
    this.getSwirlingMoonState();
    this.getSunKhopeshState();
  }

  getSwirlingMoonState(){
    this.luminaryService.getSwirlingMoon().subscribe((swirlingMoonState: LuminaryVisibility) => {
      switch (swirlingMoonState){
        case LuminaryVisibility.Hidden:
          this.isSwirlingMoonVisible = false;
          this.isSwirlingMoonDisabled = true;
          break;
        case LuminaryVisibility.Visible:
          this.isSwirlingMoonVisible = true;
          this.isSwirlingMoonDisabled = true;
          break;
        case LuminaryVisibility.Enabled:
          this.isSwirlingMoonVisible = true;
          this.isSwirlingMoonDisabled = false;
          break;
        default:
          this.isSwirlingMoonVisible = false;
          this.isSwirlingMoonDisabled = true;
          break;
      }
    });

  }

  getSunKhopeshState(){
    this.luminaryService.getSunKhopesh().subscribe((sunKhopeshState: LuminaryVisibility) => {
      switch (sunKhopeshState){
        case LuminaryVisibility.Hidden:
          this.isSunKhopeshVisible = false;
          this.isSunKhopeshDisabled = true;
          break;
        case LuminaryVisibility.Visible:
          this.isSunKhopeshVisible = true;
          this.isSunKhopeshDisabled = true;
          break;
        case LuminaryVisibility.Enabled:
          this.isSunKhopeshVisible = true;
          this.isSunKhopeshDisabled = false;
          break;
        default:
          this.isSunKhopeshVisible = false;
          this.isSunKhopeshDisabled = true;
          break;
      }
    });
  }

  navigateToSwirlingMoon(){
    this.router.navigate(['/luminaries/swirling-moon']);
  }

  navigateToSunKhopesh(){
    this.router.navigate(['/luminaries/sun-khopesh']);
  }

}
