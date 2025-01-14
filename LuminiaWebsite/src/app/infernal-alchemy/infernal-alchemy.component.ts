import { Component, OnInit } from '@angular/core';
import { LuminiaApiService } from '../services/luminia-api/luminia-api.service';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from '../snackbars/error-snackbar/error-snackbar.component';

@Component({
  selector: 'app-infernal-alchemy',
  templateUrl: './infernal-alchemy.component.html',
  styleUrls: ['./infernal-alchemy.component.css']
})
export class InfernalAlchemyComponent implements OnInit {

  researchPoints : string = "-";
  researchPointsTotal : string = "-";
  budget : string = "---";

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

  constructor(private luminiaApiService : LuminiaApiService, private snackBar: MatSnackBar) {
  }


  async ngOnInit(): Promise<void> {
    try {
      var infernalAlchemyStats$ = this.luminiaApiService.getInfernalAlchemyStats();
      var infernalAlchemyStatsDto = await firstValueFrom(infernalAlchemyStats$);

      this.researchPoints = infernalAlchemyStatsDto.researchPoints.toString();
      this.researchPointsTotal = infernalAlchemyStatsDto.researchPointsTotal.toString();
      this.budget = infernalAlchemyStatsDto.budget.toString();
    } catch {
      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        panelClass: 'error-snackbar',
        data: "Infernal Alchemy data could not be loaded.",
        duration: 10000
      });
    }
  }
}
