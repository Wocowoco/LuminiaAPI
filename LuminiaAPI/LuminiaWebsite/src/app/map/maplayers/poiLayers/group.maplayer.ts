import * as L from "leaflet";
import { IAmChildMapLayer, SingleIconMapLayer } from "../maplayer.interface";
import { MapLayerEnum } from "src/app/services/luminia-api/enums/maplayerenum";

export class GroupLayer extends SingleIconMapLayer implements IAmChildMapLayer
{
  public iconUrl;
  public name: string = "Group";
  public mapLayer = MapLayerEnum.Group;

  constructor(map: L.Map){
    const iconUrl = GroupLayer.worldmapImagePath + "icon/group.png";
    super(map, iconUrl);
    this.iconUrl = iconUrl;
    this.defaultTooltip = "Location of the group";
  }
}

