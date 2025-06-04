import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA, MatLegacySnackBarModule as MatSnackBarModule, MatLegacySnackBarRef as MatSnackBarRef } from '@angular/material/legacy-snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-snackbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.css']
})

export class ErrorSnackbarComponent implements OnInit {
  public snackBarRef = inject(MatSnackBarRef);


  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
  }

  ngOnInit(): void {
  }

}
