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
  /** This event started the Age that begins in its start year, so it's shown just before that Age's header instead of after it. */
  startsAge?: boolean;
  ongoing?: boolean;
  /** When it was played at the table, e.g. "2016–2020". */
  realLife?: string;
  /** Where in Luminia the story took place, e.g. the continent. */
  location?: string;
  /** Game system. Defaults to DEFAULT_GAME_SYSTEM for campaigns and one-shots. */
  system?: string;
  /** Character names (never player names). Wrap a name in () for a minor character, prefix it with † if they died ("(†Name)" for both). Sorted automatically, minor ones last. */
  characters?: string[];
  /** The non-canon group that played the same story. Entries with this form the branching timeline. */
  alternateCharacters?: string[];
  summary: string;
}

/** A chapter of the timeline. It runs until the next Age starts; the last one runs until today. */
export interface TimelineAge {
  id: string;
  /** Roman numeral shown as "Age IV". Left out for the time before the Ages. */
  numeral?: string;
  name: string;
  startYear: number;
  tagline: string;
}

/** The timeline starts here; the end is the current in-game year (from the API). */
export const TIMELINE_START_YEAR = -100;
/** Used for the "Now" marker when the current date can't be loaded. */
export const TIMELINE_FALLBACK_CURRENT_YEAR = 7346;
export const DEFAULT_GAME_SYSTEM = 'D&D 5e';

// The scholars' eras of Rilsonia. Every entry belongs to the last Age that started on or before its start year.
export const TIMELINE_AGES: TimelineAge[] = [
  {
    id: 'before-the-nova',
    name: 'Before the Nova',
    startYear: TIMELINE_START_YEAR,
    tagline: 'The old world, of which almost nothing survived.',
  },
  {
    id: 'age-of-mist',
    numeral: 'I',
    name: 'The Age of Mist',
    startYear: 0,
    tagline: 'The new world settles out of a glowing mist. The first peoples wake, and the first gods rise.',
  },
  {
    id: 'age-of-lumin',
    numeral: 'II',
    name: 'The Age of Lumin',
    startYear: 612,
    tagline: 'Lumin shapes the world. New gods rise and fall, and the gods go to war.',
  },
  {
    id: 'age-of-darkness',
    numeral: 'III',
    name: 'The Age of Darkness',
    startYear: 2381,
    tagline: 'Ashen skies and fifteen centuries of survival.',
  },
  {
    id: 'age-of-founding',
    numeral: 'IV',
    name: 'The Age of Founding',
    startYear: 3870,
    tagline: 'The nations of Norl are born.',
  },
  {
    id: 'age-of-the-long-war',
    numeral: 'V',
    name: 'The Age of the Long War',
    startYear: 5460,
    tagline: 'Five centuries of war between the elves of the west and the peoples of the east.',
  },
  {
    id: 'age-of-coin',
    numeral: 'VI',
    name: 'The Age of Coin',
    startYear: 6590,
    tagline: 'Merchants, guilds and banks bind the east together.',
  },
  {
    id: 'present-age',
    numeral: 'VII',
    name: 'The Present Age',
    startYear: 7180,
    tagline: 'The world as it stands today, and the age still being written.',
  },
];

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
    location: 'Geondis',
    characters: ['†Cara', 'Varis', 'Balik Hrungnorsson', "Vak'Nor", 'Lily', 'Mino', '(Eynho)', '†Nova', '†Shadow', '(Anya)', '(Fasca)'],
    summary: 'A group of adventurers called ViaNova, who, unbeknownst to them, set in motion everything that led to The Nova.',
  },
  {
    id: 'the-nova',
    type: 'event',
    title: 'The Nova',
    startYear: 0,
    startsAge: true,
    summary: 'In one blinding instant, the world was unmade and forged anew. Almost nothing of what came before survived, '
      + 'and even the event itself left barely a trace. Most believe The Nova was the universe granting itself a second chance.',
  },
  {
    id: 'the-first-ascended',
    type: 'event',
    title: 'The First Ascended',
    season: 'Bloomen',
    startYear: 288,
    location: 'Myrill',
    summary: "A dryad of the oldest grove in Myrill, who had stood in the glowing mist for nearly three centuries, woke one spring as a goddess: Fen'La. "
      + 'From then on, mortals who soaked up enough Lumin could ascend to godhood.',
  },
  {
    id: 'the-luunrise',
    type: 'event',
    title: 'The Luunrise',
    startYear: 1109,
    location: 'Norl',
    summary: 'Since The Nova the moon had been a dark, dead stone. Then a drow priestess climbed out of the Underdark, '
      + 'bathed in Lumin under the night sky and rose as Luana. That night the moon lit up for the first time.',
  },
  {
    id: 'the-god-wars',
    type: 'event',
    title: 'The God Wars and the Accord of the Peak',
    season: 'Leaflet',
    startYear: 1177,
    endYear: 1291,
    location: 'Norl',
    summary: 'For over a century the gods went to war with one another, leading mortal armies across Norl. Many gods rose and fell, and whole peoples were caught in between. '
      + 'The war ended on Pantheon Peak with the Accord of the Peak: the surviving gods were bound to three pantheons of four, the White, the Grey and the Black. '
      + 'Since that night, no god has walked among mortals.',
  },
  {
    id: 'the-blackfall',
    type: 'event',
    title: 'The Blackfall',
    season: 'Leaflet',
    startYear: 2381,
    location: 'Chorne Derev',
    summary: 'A swarm of black stones fell on the north of Norl and raised new land from the sea where northern Chorne Derev now lies. '
      + 'Dust hid the sun for decades.',
  },
  {
    id: 'founding-of-istralor',
    type: 'event',
    title: "The Founding of Istra'lor",
    startYear: 3870,
    location: 'Myrill',
    summary: "The forest-clans of Myrill united under a single High Seat, raising Istra'lor as the capital of the elves.",
  },
  {
    id: 'founding-of-valu-tehas',
    type: 'event',
    title: "Valu'Tehas Is Born",
    startYear: 4022,
    location: 'Chorne Derev',
    summary: 'Gnome and dwarf engineers hollowed out one of the black mountains created by the Blackfall and built a city inside it in tiers: '
      + "Valu'Tehas, the city of invention.",
  },
  {
    id: 'founding-of-rilsonia',
    type: 'event',
    title: 'The White City',
    startYear: 4460,
    location: 'Rilsonia',
    summary: 'Mages fleeing the petty wars of the Kewaran coast built a city of white stone on the sea. Rilsonia would become the heart of magic on Norl.',
  },
  {
    id: 'the-mageblight',
    type: 'event',
    title: 'The Mageblight',
    startYear: 5461,
    location: 'Myrill',
    summary: 'A sickness of magic swept through Myrill, turning spells against their casters, and thousands died. It has never fully gone away. '
      + "In its wake, Myrill outlawed all spellcasting with the Istra'lorian Edict.",
  },
  {
    id: 'the-long-war',
    type: 'event',
    title: 'The Long War',
    season: 'Bloomen',
    startYear: 5489,
    endYear: 6020,
    location: 'Norl',
    summary: 'The elves, who then ruled the whole west of Norl, marched east, blaming eastern sorcery for the Mageblight. '
      + 'After five centuries of war they retreated to Myrill, and the west split into Myrill, Tikushi and Paikka.',
  },
  {
    id: 'the-landing',
    type: 'event',
    title: 'The Landing',
    startYear: 6142,
    location: 'Sinawiran',
    summary: 'Settlers from a continent to the south landed on the empty southern shore of Norl and founded Sinawiran. '
      + 'Within fifty years they had settled the whole coast, from Myrill to Kewara.',
  },
  {
    id: 'the-claw',
    type: 'event',
    title: 'The Claw',
    startYear: 6880,
    location: 'North Paikka',
    summary: 'Hunters in the forests of North Paikka formed a guild to deal with the beasts that roam the wilds.',
  },
  {
    id: 'stability-network',
    type: 'event',
    title: 'The Stability Network',
    startYear: 7050,
    location: 'North Paikka',
    summary: 'A horse-trading family from North Paikka set up stables across the continent, with the same prices everywhere. '
      + 'The Stability Network still runs almost every stable in Norl.',
  },
  {
    id: 'eastern-regions-bank',
    type: 'event',
    title: 'The Eastern Regions Bank',
    startYear: 7104,
    location: 'Chorne Derev',
    summary: "Gnome engineers and priests of Kaz founded the Eastern Regions Bank in Valu'Tehas, engraving each account code onto its holder's soul.",
  },
  {
    id: 'the-riftwalkers',
    type: 'event',
    title: 'The Riftwalkers',
    startYear: 7183,
    location: 'Alodia',
    summary: "When rifts began tearing open around Murkcliff, the city's quarrymen, hedge-mages and sellswords formed a guild "
      + 'to ride into the rifts on black pegasi and close them from the inside: the Riftwalkers.',
  },
  {
    id: 'grey-tyrants-war',
    type: 'event',
    title: "The Grey Tyrant's War",
    startYear: 7317,
    endYear: 7320,
    location: 'Norl',
    summary: 'A renegade archmage raised an army of bound rift-beasts and tried to take the continent by force. '
      + 'The Ivory Legion, the Riftwalkers and battle-mages from Sinawiran broke his army.',
  },
  {
    id: 'gemstone-exchange',
    type: 'event',
    title: 'The Gemstone Exchange',
    season: 'Sumsun',
    startYear: 7332,
    location: 'Chorne Derev',
    summary: 'The Eastern Regions Bank opened the Gemstone Exchange in Chorne Derev, where gemstones are traded at prices that change by the day. '
      + 'Rilsonia and Alodia joined together in 7338.',
  },
  {
    id: 'call-of-the-claw',
    type: 'story-arc',
    title: 'Call of the Claw',
    logoImage: 'assets/images/timeline/call-of-the-claw.webp',
    season: 'Bloomen',
    startYear: 7339,
    realLife: '2025',
    location: 'Norl',
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
    location: 'Norl',
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
    location: 'Norl',
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
    location: 'Norl',
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
    location: 'Norl',
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
    location: 'Norl',
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
    location: 'Norl',
    characters: ['Aubron Bronzbow', "Kar'Chi Gogdavn", 'Nexire', 'Scrat', 'Ulfgar', '(Mackenzie Vertez)', '(Mander Moon)'],
    summary: 'The Purple Bandits have started using a dangerous new poison that no one seems to know. '
      + 'Invitations to the Mizude Sumsun festival brought a group of adventurers together to get to the bottom of it.',
  },
];
