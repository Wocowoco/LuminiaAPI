export interface IDeityInfo {
  avatarUrl: string;
  iconUrl: string;
  backgroundUrl: string;
  name: string;
  domains: string;
  pronoun: string;
  gender: string;
  race: string;
  alignment: string;
  titles: string[];
  /** Words in the titles that hide a secret, mapped to the secret's key in the database (luminia.secrets). */
  secrets?: Record<string, string>;
}
