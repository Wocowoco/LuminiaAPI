import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LuminiaApiService } from '../../services/luminia-api/luminia-api.service';
import { InfernalAlchemyStatsDto } from '../../services/luminia-api/dtos/infernalAlchemyStatsDto.interface';

/** DM tool: set the Infernal Alchemy gold budget and Research Points. */
@Component({
  selector: 'app-infernal-alchemy-stats',
  templateUrl: './infernal-alchemy-stats.component.html',
  styleUrls: ['./infernal-alchemy-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class InfernalAlchemyStatsComponent implements OnInit {

  budget = 0;
  researchPoints = 0;
  researchPointsTotal = 0;
  status = 'Loading…';
  saving = false;
  loaded = false;
  private saved: InfernalAlchemyStatsDto | null = null;

  constructor(private luminiaApiService: LuminiaApiService) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.apply(await firstValueFrom(this.luminiaApiService.getInfernalAlchemyStats()));
      this.loaded = true;
      this.status = '';
    } catch {
      this.status = 'Infernal Alchemy data could not be loaded.';
    }
  }

  get dirty(): boolean {
    return !!this.saved && (this.budget !== this.saved.budget
      || this.researchPoints !== this.saved.researchPoints
      || this.researchPointsTotal !== this.saved.researchPointsTotal);
  }

  get valid(): boolean {
    return [this.budget, this.researchPoints, this.researchPointsTotal].every(v => Number.isInteger(v))
      && this.researchPoints >= 0 && this.researchPointsTotal >= 0;
  }

  /** Awarding a point raises both the current and the total amount. */
  awardPoint(): void {
    this.researchPoints++;
    this.researchPointsTotal++;
  }

  reset(): void {
    if (this.saved) this.apply(this.saved);
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      this.apply(await firstValueFrom(this.luminiaApiService.updateInfernalAlchemyStats({
        budget: this.budget,
        researchPoints: this.researchPoints,
        researchPointsTotal: this.researchPointsTotal,
      })));
      this.status = 'Saved.';
    } catch {
      this.status = 'Saving failed.';
    } finally {
      this.saving = false;
    }
  }

  private apply(stats: InfernalAlchemyStatsDto): void {
    this.saved = { ...stats };
    this.budget = stats.budget;
    this.researchPoints = stats.researchPoints;
    this.researchPointsTotal = stats.researchPointsTotal;
  }
}
