import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LuminiaApiService } from '../../services/luminia-api/luminia-api.service';
import { ResearchNode, researchTree } from '../../infernal-alchemy/research-tree/research-tree.data';
import { sectionOf } from '../../infernal-alchemy/research-tree/potions';

interface UnlockGroup {
  title: string;
  nodes: ResearchNode[];
}

/** DM tool: tick which Alchemical Research Tree nodes the party has unlocked, then save them to the database. */
@Component({
  selector: 'app-research-unlocks',
  templateUrl: './research-unlocks.component.html',
  styleUrls: ['./research-unlocks.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ResearchUnlocksComponent implements OnInit {

  /** Nodes grouped by the potion (or Smoozies group) they belong to, in tree order. */
  readonly groups: UnlockGroup[] = [];
  checked = new Set<string>();
  status = 'Loading…';
  saving = false;
  private saved = new Set<string>();

  constructor(private luminiaApiService: LuminiaApiService) {
    const byTitle = new Map<string, UnlockGroup>();
    for (const node of researchTree) {
      const title = sectionOf(node)?.label ?? 'Other';
      if (!byTitle.has(title)) {
        byTitle.set(title, { title, nodes: [] });
        this.groups.push(byTitle.get(title)!);
      }
      byTitle.get(title)!.nodes.push(node);
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      this.saved = new Set(await firstValueFrom(this.luminiaApiService.getResearchUnlocks()));
      this.checked = new Set(this.saved);
      this.status = '';
    } catch {
      this.status = 'Research unlocks could not be loaded.';
    }
  }

  get dirty(): boolean {
    return this.checked.size !== this.saved.size || [...this.checked].some(id => !this.saved.has(id));
  }

  toggle(id: string, on: boolean): void {
    on ? this.checked.add(id) : this.checked.delete(id);
  }

  /** Parents of a checked node that aren't checked (the node can't really be unlocked yet). */
  missingParents(node: ResearchNode): string {
    if (!this.checked.has(node.id)) return '';
    return (node.parents ?? [])
      .map(p => typeof p === 'string' ? p : p.from)
      .filter(id => !this.checked.has(id))
      .map(id => researchTree.find(n => n.id === id)?.label ?? id)
      .join(', ');
  }

  reset(): void {
    this.checked = new Set(this.saved);
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      // Keep tree order so the stored order is predictable
      const ids = researchTree.map(n => n.id).filter(id => this.checked.has(id));
      this.saved = new Set(await firstValueFrom(this.luminiaApiService.updateResearchUnlocks(ids)));
      this.checked = new Set(this.saved);
      this.status = `Saved ${this.saved.size} unlocked nodes.`;
    } catch {
      this.status = 'Saving failed.';
    } finally {
      this.saving = false;
    }
  }
}
