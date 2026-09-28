import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom } from 'rxjs';
import { LuminiaApiService } from '../../services/luminia-api/luminia-api.service';
import { openSecretDialog } from './secret-dialog/secret-dialog.component';
import { activePathSecrets, deactivatePathSecret, pageOf, recordVisit } from './secret-path.store';

/**
 * Watches which pages a player visits. For every path secret they've started (read the directions of),
 * it asks the API whether their last pages are the path, and opens the secret's popup when they are.
 * The path itself only lives in the database.
 */
@Injectable({
  providedIn: 'root'
})
export class SecretPathService {

  constructor(router: Router, private luminiaApiService: LuminiaApiService, private dialog: MatDialog) {
    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.visit(event.urlAfterRedirects));
  }

  private async visit(url: string): Promise<void> {
    const visited = recordVisit(pageOf(url));

    for (const [secretKey, pathLength] of Object.entries(activePathSecrets())) {
      if (visited.length < pathLength) continue;

      const walkedPath = visited.slice(-pathLength).join(' > ');
      try {
        const result = await firstValueFrom(this.luminiaApiService.walkSecret(secretKey, walkedPath));
        if (result.correct) {
          deactivatePathSecret(secretKey);
          openSecretDialog(this.dialog, { secretKey, walkedPath });
        }
      } catch (error) {
        // A secret that no longer exists shouldn't be checked forever; anything else (offline, rate limit) is retried on the next page
        if ((error as { status?: number }).status === 404) {
          deactivatePathSecret(secretKey);
        }
      }
    }
  }
}
