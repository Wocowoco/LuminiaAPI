export interface Item {
  name: string,
  description: string,
  category: string,
  cost: number,
  /*
  isMagicItem: boolean,
  isAttunement: boolean,
  isVisibleToPublic: boolean,
  */
}

export enum ItemCategory {
  ring = "ring",
  potion = "potion",
}

