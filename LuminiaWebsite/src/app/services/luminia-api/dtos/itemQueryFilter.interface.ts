import { Item, ItemCategory } from "./item.interface";

export interface IItemQueryFilter{
  showMagicItems: boolean,
  showNormalItems: boolean,
  showPotions: boolean,
  showRings: boolean,
  allowedCategories: ItemCategory[];
  filterName: string
}

export class ItemQueryFilter implements IItemQueryFilter{
  showMagicItems = false;
  showNormalItems = false;
  showPotions = false;
  showRings = false;
  filterName = "";
  allowedCategories: ItemCategory[] = [];
}


