import { IDeityInfo } from "../deity-info.interface";

export class LokaineDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/unknown.png";
  iconUrl = "../../../assets/images/pantheon/lokaine-icon.png";
  name = "Lokaine";
  pronoun = "Goddess";
  domains = "Cold, Obsession, Loneliness";
  titles = [];
  gender = "Female";
  race = "Dragonborn";
  alignment = "Chaotic Evil";
}
