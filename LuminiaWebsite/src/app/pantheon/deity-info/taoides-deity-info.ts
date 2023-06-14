import { IDeityInfo } from "../deity-info.interface";

export class TaoidesDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/unknown.png";
  iconUrl = "../../../assets/images/pantheon/taoides-icon.png";
  name = "Taoides";
  pronoun = "Goddess";
  domains = "Storms, Water, Thunder, Sound, Lightning";
  titles = ["Keeper of Tides"];
  gender = "Female";
  race = "Triton/Merfolk";
  alignment = "Chaotic Neutral";
}
