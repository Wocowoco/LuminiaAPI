import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-luminary',
  templateUrl: './luminary.component.html',
  styleUrls: ['./luminary.component.css'],
})
export class LuminaryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToSwirlingMoon(){
    this.router.navigate(['/luminaries/swirling-moon']);
  }

}
