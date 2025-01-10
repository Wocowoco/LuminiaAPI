import { MapLayerEnum } from "../enums/maplayerenum"

export interface MarkerDto{
  posX: number
  posY: number
  mapLayerId: MapLayerEnum
  titleText: string
  descriptionText: string
  width: number
  height: number
  imageUrl: string
}
