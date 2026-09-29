import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom } from 'rxjs';
import { LuminiaApiService } from '../../services/luminia-api/luminia-api.service';
import { openSecretDialog } from './secret-dialog/secret-dialog.component';
import { WalkedKind, activeSecrets, deactivateSecret, pageOf, recordVisit } from './secret-path.store';

const MAX_STEPS = 20;

/**
 * Watches which pages a player visits (path secrets) and what they click (sequence secrets, see {@link step}).
 * For every such secret they've started (read the directions of), it asks the API whether their last steps
 * are the answer, and opens the secret's popup when they are. The answer itself only lives in the database.
 */
@Injectable({
  providedIn: 'root'
})
export class SecretPathService {

  /** Things clicked in this tab, oldest first. Unlike pages, clicking the same thing twice counts twice. */
  private steps: string[] = [];

  constructor(router: Router, private luminiaApiService: LuminiaApiService, private dialog: MatDialog) {
    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.check('path', recordVisit(pageOf(event.urlAfterRedirects))));
  }

  /** Records a click for sequence secrets, e.g. `step('healing')` when a research tree node is tapped. */
  step(id: string): void {
    this.steps = [...this.steps, id].slice(-MAX_STEPS);
    this.check('sequence', this.steps);
  }

  private async check(kind: WalkedKind, trail: string[]): Promise<void> {
    for (const [secretKey, length] of Object.entries(activeSecrets(kind))) {
      if (trail.length < length) continue;

      const walkedPath = trail.slice(-length).join(' > ');
      try {
        const result = await firstValueFrom(this.luminiaApiService.walkSecret(secretKey, walkedPath));
        if (result.correct) {
          deactivateSecret(kind, secretKey);
          openSecretDialog(this.dialog, { secretKey, walkedPath });
        }
      } catch (error) {
        // A secret that no longer exists shouldn't be checked forever; anything else (offline, rate limit) is retried on the next step
        if ((error as { status?: number }).status === 404) {
          deactivateSecret(kind, secretKey);
        }
      }
    }
  }
}
