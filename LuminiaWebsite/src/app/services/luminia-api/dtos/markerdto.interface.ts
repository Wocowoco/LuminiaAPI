import { MapLayerEnum } from "../enums/maplayerenum"

export interface MarkerDto{
  posX: number
  posY: number
  mapLayerId: MapLayerEnum
  popupText: string
}
