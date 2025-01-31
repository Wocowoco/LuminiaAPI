import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dm-page',
  templateUrl: './dm-page.component.html',
  styleUrls: ['./dm-page.component.css']
})
export class DmPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

}
