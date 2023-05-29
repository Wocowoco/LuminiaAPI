import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ItemCategory } from 'src/app/services/luminia-api/dtos/item.interface';
import { ItemQueryFilter } from 'src/app/services/luminia-api/dtos/itemQueryFilter.interface';

@Component({
  selector: 'app-itemfilter',
  templateUrl: './itemfilter.component.html',
  styleUrls: ['./itemfilter.component.css']
})

export class ItemfilterComponent implements OnInit {

  @Output() itemsSearchQueryEvent = new EventEmitter<ItemQueryFilter>();

  showMagicItems: boolean = true;
  showNormalItems: boolean = true;
  showPotion: boolean = true;
  showRing: boolean = true;
  filterName: string = "";
  itemsQueryFilter: ItemQueryFilter = new ItemQueryFilter;

  constructor() { }

  ngOnInit(): void {
  }

  setItemFilter() {
    this.itemsQueryFilter.allowedCategories = [];
    this.itemsQueryFilter.showMagicItems = this.showMagicItems;
    this.itemsQueryFilter.showNormalItems = this.showNormalItems;
    this.itemsQueryFilter.filterName = this.filterName;

    //Categories
    if(this.showPotion)
    {
      this.itemsQueryFilter.allowedCategories.push(ItemCategory.potion);
    }
    if(this.showRing)
    {
      this.itemsQueryFilter.allowedCategories.push(ItemCategory.ring);
    }

    this.itemsSearchQueryEvent.emit(this.itemsQueryFilter);
  }

}
