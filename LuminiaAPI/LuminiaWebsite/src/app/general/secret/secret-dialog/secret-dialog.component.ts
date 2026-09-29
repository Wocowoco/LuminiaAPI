import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { LuminiaApiService } from '../../../services/luminia-api/luminia-api.service';
import { SecretDto } from '../../../services/luminia-api/dtos/secretDto.interface';
import { activateSecret } from '../secret-path.store';

export interface SecretDialogData {
  secretKey: string;
  /** For path and sequence secrets: the steps the player just did (pages or clicked ids, joined by " > "). */
  walkedPath?: string;
}

type SecretState = 'loading' | 'missing' | 'error' | 'open' | 'claimed' | 'won';

/** A piece of a puzzle: plain text, or a coloured circle written as e.g. "[red]" in the puzzle (text is then the colour name, for screen readers). */
export interface PuzzlePart {
  text?: string;
  color?: string;
}

const NAME_STORAGE_KEY = 'luminia-secret-name';

const PUZZLE_COLORS: Record<string, string> = {
  red: '#C0392B',
  blue: '#2E5FBF',
  green: '#3F8A4A',
  yellow: '#E0B32E',
  purple: '#7B4FA8',
  orange: '#D9782D',
  black: '#2C2B25',
  white: '#FBFBF2',
};

/** Splits a puzzle into text and coloured circles: "[red] [blue]" becomes two circles. Unknown [words] stay text. */
export function puzzleParts(puzzle: string): PuzzlePart[] {
  return puzzle
    .split(/(\[[a-z]+\])/i)
    .filter(part => part !== '')
    .map(part => {
      const color = PUZZLE_COLORS[part.slice(1, -1).toLowerCase()];
      return part.startsWith('[') && color ? { color, text: part.slice(1, -1).toLowerCase() } : { text: part };
    });
}

export function openSecretDialog(dialog: MatDialog, data: SecretDialogData): void {
  dialog.open<SecretDialogComponent, SecretDialogData>(SecretDialogComponent, {
    data,
    width: '480px',
    maxWidth: 'calc(100vw - 32px)',
    autoFocus: 'first-tabbable',
    panelClass: 'secret-dialog-panel',
  });
}

/** The puzzle behind a secret, and the form to answer it (or, for a path secret, to claim the walked path). */
@Component({
  selector: 'app-secret-dialog',
  templateUrl: './secret-dialog.component.html',
  styleUrls: ['./secret-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SecretDialogComponent implements OnInit {

  state: SecretState = 'loading';
  secret?: SecretDto;
  puzzleParts: PuzzlePart[] = [];
  name = '';
  answer = '';
  submitting = false;
  /** Feedback on the last wrong or rejected answer. */
  message = '';
  /** Bumped on every wrong answer to replay the shake animation. */
  wrongCount = 0;
  /** Set when a player gives the right answer to a secret someone else already solved. */
  correctAnswer = false;
  claimedBy = '';
  claimedDate: string | null = null;
  reward = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: SecretDialogData,
    private luminiaApiService: LuminiaApiService) {
    try {
      this.name = localStorage.getItem(NAME_STORAGE_KEY) ?? '';
    } catch { }
  }

  /** Path and sequence secrets are solved by doing steps in order, not by typing an answer. */
  get isWalked(): boolean {
    return this.secret?.kind === 'path' || this.secret?.kind === 'sequence';
  }

  /** Shown once the steps are done: walking pages for a path, clicking in order for a sequence. */
  get walkedMessage(): string {
    return this.secret?.kind === 'sequence' ? 'The pattern is complete.' : 'You have walked the path.';
  }

  async ngOnInit(): Promise<void> {
    try {
      this.secret = await firstValueFrom(this.luminiaApiService.getSecret(this.data.secretKey));
      this.puzzleParts = puzzleParts(this.secret.puzzle);
      if ((this.secret.kind === 'path' || this.secret.kind === 'sequence') && !this.data.walkedPath && this.secret.pathLength) {
        // From now on, every page visited (path) or thing clicked (sequence) is checked against the answer (see SecretPathService)
        activateSecret(this.secret.kind, this.secret.secretKey, this.secret.pathLength);
      }

      if (this.secret.claimedBy) {
        this.showClaimed(this.secret.claimedBy, this.secret.claimedDate);
        if (this.data.walkedPath) {
          this.correctAnswer = true;
          this.message = `${this.walkedMessage} You solved it too.`;
        }
      } else {
        this.state = 'open';
      }
    } catch (error) {
      this.state = error instanceof HttpErrorResponse && error.status === 404 ? 'missing' : 'error';
    }
  }

  /** Whether the player can give an answer here: always for typed answers, only after walking for paths and sequences. */
  get canAnswer(): boolean {
    return (this.state === 'open' || this.state === 'claimed') && !this.correctAnswer && (!this.isWalked || !!this.data.walkedPath);
  }

  get canSubmit(): boolean {
    // Once someone has solved the secret, only the answer is needed: there's no reward left to claim
    const needsName = this.state === 'open';
    const answer = this.data.walkedPath ?? this.answer;
    return this.canAnswer && !this.submitting && answer.trim().length > 0 && (!needsName || this.name.trim().length > 0);
  }

  async submit(): Promise<void> {
    if (!this.canSubmit) return;

    const alreadySolved = this.state === 'claimed';
    this.submitting = true;
    this.message = '';
    if (!alreadySolved) {
      try {
        localStorage.setItem(NAME_STORAGE_KEY, this.name.trim());
      } catch { }
    }

    try {
      const result = await firstValueFrom(this.luminiaApiService.attemptSecret(this.data.secretKey, {
        name: alreadySolved ? '' : this.name.trim(),
        answer: this.data.walkedPath ?? this.answer,
      }));

      if (result.claimed) {
        this.reward = result.reward ?? '';
        this.claimedBy = result.claimedBy ?? this.name.trim();
        this.claimedDate = result.claimedDate;
        this.state = 'won';
      } else if (result.correct) {
        this.message = alreadySolved
          ? 'That is the answer! You solved it too.'
          : `That is the answer! But ${result.claimedBy} solved it just before you.`;
        this.correctAnswer = true;
        if (result.claimedBy) {
          this.showClaimed(result.claimedBy, result.claimedDate);
        }
      } else {
        this.message = 'That is not the answer.';
        this.wrongCount++;
        if (result.claimedBy && !alreadySolved) {
          this.showClaimed(result.claimedBy, result.claimedDate);
        }
      }
    } catch (error) {
      this.message = error instanceof HttpErrorResponse && error.status === 429
        ? 'Too many guesses. Try again in a minute.'
        : 'Nothing answers right now. Try again later.';
    } finally {
      this.submitting = false;
    }
  }

  private showClaimed(claimedBy: string, claimedDate: string | null): void {
    this.claimedBy = claimedBy;
    this.claimedDate = claimedDate;
    this.state = 'claimed';
  }
}
