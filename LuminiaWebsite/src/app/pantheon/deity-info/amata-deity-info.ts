import { IDeityInfo } from "../deity-info.interface";

export class AmataDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/amata-avatar.png";
  iconUrl = "../../../assets/images/pantheon/amata-icon.png";
  backgroundUrl = "../../../assets/images/decorations/pantheon-amata.png";
  name = "Amata";
  pronoun = "God";
  domains = "Creation, Invention, Knowledge, Exploration, Air (Focuses on Arcane Arts)";
  titles = ["The Twin God"];
  gender = "Male";
  race = "Gnome";
  alignment = "Lawful Neutral";
}
