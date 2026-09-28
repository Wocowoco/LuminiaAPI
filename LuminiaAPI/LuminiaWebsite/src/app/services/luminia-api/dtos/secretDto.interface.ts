/** What anyone may know about a secret: the puzzle and whether (and by whom) it was claimed. */
export interface SecretDto {
  secretKey: string;
  name: string;
  /** 'answer': players type the answer. 'path': players walk it by visiting pages in order. */
  kind: 'answer' | 'path';
  puzzle: string;
  /** How many pages the path has (path secrets only). */
  pathLength: number | null;
  claimedBy: string | null;
  claimedDate: string | null;
}

export interface SecretAttemptDto {
  name: string;
  answer: string;
}

export interface SecretAttemptResultDto {
  /** True when this attempt claimed the secret. */
  claimed: boolean;
  /** Whether the answer was right, also when the secret was already claimed. */
  correct: boolean;
  claimedBy: string | null;
  claimedDate: string | null;
  /** Only filled in for the player who just claimed the secret. */
  reward: string | null;
}
