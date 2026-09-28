import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { openSecretDialog } from './secret-dialog/secret-dialog.component';

/**
 * Turns its content into a hidden secret: `<app-secret secretKey="luana-weapon">Secrets</app-secret>`.
 * Clicking it opens the secret's puzzle. The puzzle, answer and reward live in the database
 * (luminia.secrets), keyed by secretKey, so none of it is in the website's code.
 */
@Component({
  selector: 'app-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SecretComponent {
  @Input({ required: true }) secretKey!: string;

  constructor(private dialog: MatDialog) { }

  open(): void {
    openSecretDialog(this.dialog, { secretKey: this.secretKey });
  }
}
