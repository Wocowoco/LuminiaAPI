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

  earningsData = [
    {range: "< 9", result: "-50 gold"},
    {range: "10-14", result: "25 gold"},
    {range: "15-19", result: "75 gold"},
    {range: "20-24", result: "100 gold"},
    {range: "25-29", result: "125 gold"},
    {range: "30-34", result: "150 gold"},
    {range: "35-39", result: "175 gold"},
    {range: "40-44", result: "200 gold"},
    {range: "> 45", result: "250 gold"}
  ];

  researchData = [
    {price: "25 gold", dc: "20"},
    {price: "50 gold", dc: "15"},
    {price: "75 gold", dc: "11"},
    {price: "100 gold", dc: "8"},
  ];
  displayedColumns: string[] = ["dc", "effect"]
  constructor() { }

  ngOnInit(): void {
  }

}
