import { IDeityInfo } from "../deity-info.interface";

export class LokaineDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/lokaine-avatar.png";
  iconUrl = "../../../assets/images/pantheon/lokaine-icon.png";
  backgroundUrl = "../../../assets/images/decorations/pantheon-lokaine.png";
  name = "Lokaine";
  pronoun = "Goddess";
  domains = "Cold, Obsession, Loneliness";
  titles = [];
  gender = "Female";
  race = "Dragonborn";
  alignment = "Chaotic Evil";
}
