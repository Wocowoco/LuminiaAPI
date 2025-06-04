import { CdkTable } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { LuminiaApiService } from 'src/app/services/luminia-api/luminia-api.service';
import { Item } from '../../services/luminia-api/dtos/item.interface';
import { ItemQueryFilter } from 'src/app/services/luminia-api/dtos/itemQueryFilter.interface';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit {
  @ViewChild(MatTable) table?: MatTable<Item>;

  displayedColumns: string[] = ["name", "cost", "category", "magicItem"]
  itemData : Item[] = []

  constructor(private luminiaApiService: LuminiaApiService) { }

  ngOnInit(): void {
    //Get all items on load
    try{
      this.luminiaApiService.getAllItems().subscribe(data => {
        this.itemData = data;
        this.table?.renderRows;
      });
    } catch(e) {
      //Error
    }
  }

  searchItemsFiltered(nameFilter: ItemQueryFilter)
  {
    try{
      this.luminiaApiService.getAllItems("?name=" + nameFilter.filterName).subscribe(data => {
        this.itemData = data;
        this.table?.renderRows;
      });
    } catch(e) {
      //Error
    }

  }

}
