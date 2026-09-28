import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SecretComponent } from './secret.component';
import { SecretDialogComponent } from './secret-dialog/secret-dialog.component';
import { SecretPathService } from './secret-path.service';

@NgModule({
  declarations: [
    SecretComponent,
    SecretDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    SecretComponent
  ],
})
export class SecretModule {
  // Injected here so path secrets are watched on every page from the moment the app starts
  constructor(_secretPathService: SecretPathService) { }
}
