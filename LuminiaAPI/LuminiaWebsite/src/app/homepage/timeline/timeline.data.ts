export type TimelineEntryType = 'campaign' | 'story-arc' | 'oneshot' | 'event';
export type Season = 'Bloomen' | 'Sumsun' | 'Leaflet' | 'Frizwa';

export const SEASONS: Season[] = ['Bloomen', 'Sumsun', 'Leaflet', 'Frizwa'];

/** Campaigns and story arcs (the newer campaigns) get the large card and dot. */
export const MAJOR_ENTRY_TYPES: TimelineEntryType[] = ['campaign', 'story-arc'];

export interface TimelineEntry {
  id: string;
  type: TimelineEntryType;
  /** Badge text, e.g. "Campaign 1". Defaults to the type ("Story Arc", "One-shot", "World event"). */
  label?: string;
  title: string;
  /** Logo artwork (transparent WebP, ~1200px wide) in assets/images/timeline/, shown in place of the title. */
  logoImage?: string;
  season?: Season;
  /** Negative = PN (Pre-Nova), 0 = The Nova, positive = AN (After Nova). */
  startYear: number;
  endYear?: number;
  ongoing?: boolean;
  /** When it was played at the table, e.g. "2016–2020". */
  realLife?: string;
  /** Game system. Defaults to DEFAULT_GAME_SYSTEM for campaigns and one-shots. */
  system?: string;
  /** Character names (never player names). Wrap a name in () for a minor character. Sorted automatically, minor ones last. */
  characters?: string[];
  /** The non-canon group that played the same story. Entries with this form the branching timeline. */
  alternateCharacters?: string[];
  summary: string;
}

/** The timeline starts here; the end is the current in-game year (from the API). */
export const TIMELINE_START_YEAR = -100;
/** Used for the "Now" marker when the current date can't be loaded. */
export const TIMELINE_FALLBACK_CURRENT_YEAR = 7346;
export const DEFAULT_GAME_SYSTEM = 'D&D 5e';

// Entries are sorted by year and season; entries in the same season keep this order.
export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'vianova',
    type: 'campaign',
    label: 'Campaign 1',
    title: 'ViaNova',
    logoImage: 'assets/images/timeline/vianova.webp',
    startYear: -2,
    endYear: 0,
    realLife: '2016–2020',
    characters: ['Cara', 'Varis', 'Balik', "Vak'Nor", 'Lily', 'Mino', '(Eynho)', 'Nova', 'Shadow', '(Anya)', '(Fasca)'],
    summary: 'A group of adventurers called ViaNova, who, unbeknownst to them, set in motion everything that led to The Nova.',
  },
  {
    id: 'the-nova',
    type: 'event',
    title: 'The Nova',
    startYear: 0,
    summary: 'The reshaping of the world as we know it. Almost no information survives from before The Nova, or about the event itself. '
      + 'It is believed to have been the universe getting a second chance.',
  },
  {
    id: 'call-of-the-claw',
    type: 'story-arc',
    title: 'Call of the Claw',
    logoImage: 'assets/images/timeline/call-of-the-claw.webp',
    season: 'Bloomen',
    startYear: 7342,
    realLife: '2025',
    system: 'Daggerheart',
    characters: ['Atherius Piruatus', 'Cho', 'Lokbrok', 'Puddington', 'Sylvara'],
    summary: 'Novice hunters of The Claw, working their way up the ranks by hunting monsters.',
  },
  {
    id: 'sticky-situations',
    type: 'oneshot',
    title: 'Sticky Situations',
    logoImage: 'assets/images/timeline/sticky-situations.webp',
    season: 'Sumsun',
    startYear: 7344,
    realLife: '2021',
    characters: ['Aubron', 'Bothor', 'Mander', 'Tandoril'],
    alternateCharacters: ['Bingo', 'Far', 'Jalin', 'Kiba', 'Samael'],
    summary: 'A basement infested with red jelly led a group of adventurers to clear out a cave full of the stuff, until the Riftwalkers stepped in.',
  },
  {
    id: 'fungal-frenzy',
    type: 'oneshot',
    title: 'Fungal Frenzy',
    logoImage: 'assets/images/timeline/fungal-frenzy.webp',
    season: 'Bloomen',
    startYear: 7345,
    realLife: '2021',
    characters: ['Aubron', 'Kiba', 'Mander', 'Far'],
    alternateCharacters: ['Bingo', 'Chaverin', 'Elidlmoormo', 'Elwood', 'Jeff'],
    summary: 'Farmers around Zalias reported plant life getting a mind of its own, and even found an elf who had become part mushroom.',
  },
  {
    id: 'crystalline-chaos',
    type: 'oneshot',
    title: 'Crystalline Chaos',
    logoImage: 'assets/images/timeline/crystalline-chaos.webp',
    season: 'Sumsun',
    startYear: 7345,
    realLife: '2022',
    characters: ['Aubron', 'Mander', 'Nexire', "X'eno"],
    alternateCharacters: ['Malachai', 'Pip', 'Tiny'],
    summary: "A mysterious force stopped the mining bots in mining site D5 near Valu'Tehas from working. "
      + 'The group was recruited to solve the issue, dealing with any threats along the way.',
  },
  {
    id: 'snowchow-showdown',
    type: 'oneshot',
    title: 'Snowchow Showdown',
    logoImage: 'assets/images/timeline/snowchow-showdown.webp',
    season: 'Frizwa',
    startYear: 7345,
    realLife: '2022',
    characters: ['Aubron', 'Nexire', 'Ragnok', "X'eno"],
    alternateCharacters: ['Mander', 'Pip', 'Rabbit', 'Tiny'],
    summary: 'A package needed to be delivered in the Frozen Wastes of Aritunn. Because of the harsh weather, no one would take the job '
      + 'until these adventurers showed up. They explored an old ruined city and stumbled upon a long-forgotten shrine to Cara.',
  },
  {
    id: 'divine-dust',
    type: 'oneshot',
    title: 'Divine Dust',
    logoImage: 'assets/images/timeline/divine-dust.webp',
    season: 'Frizwa',
    startYear: 7345,
    realLife: '2022',
    characters: ['Aubron', 'Nexire', 'Ragnok', "X'eno"],
    alternateCharacters: ['Mander', 'Pip', 'Rabbit', 'Tiny'],
    summary: "A farmer's sheep went missing, and travellers had seen shady people dragging sheep up Pantheon Peak. "
      + 'The group was hired to deal with those people and bring the sheep back.',
  },
  {
    id: 'gate-of-slithers',
    type: 'story-arc',
    title: 'Gate of Slithers',
    logoImage: 'assets/images/timeline/gate-of-slithers.webp',
    season: 'Sumsun',
    startYear: 7346,
    ongoing: true,
    realLife: '2024–now',
    characters: ['Aubron', "Kar'Chi", 'Nexire', 'Scrat', 'Ulfgar', '(Mackenzie)', '(Mander)'],
    summary: 'The Purple Bandits have started using a dangerous new poison that no one seems to know. '
      + 'Invitations to the Mizude Sumsun festival brought a group of adventurers together to get to the bottom of it.',
  },
];
