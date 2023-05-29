import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
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
