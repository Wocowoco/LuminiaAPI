import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infernal-alchemy',
  templateUrl: './infernal-alchemy.component.html',
  styleUrls: ['./infernal-alchemy.component.css']
})
export class InfernalAlchemyComponent implements OnInit {

  researchPoints : number = 1;
  researchPointsTotal : number = 7;
  amountOfMoney : number = 402;

  constructor() { }

  ngOnInit(): void {
  }

}
