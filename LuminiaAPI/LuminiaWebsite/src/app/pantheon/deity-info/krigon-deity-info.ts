import { IDeityInfo } from "../deity-info.interface";

export class KrigonDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/krigon-avatar.png";
  iconUrl = "../../../assets/images/pantheon/krigon-icon.png";
  backgroundUrl = "../../../assets/images/decorations/pantheon-krigon.png";
  name = "Krigon";
  pronoun = "God";
  domains = "War, Blood, Pain, Sacrifice";
  titles = [];
  gender = "Male";
  race = "Centaur";
  alignment = "Neutral Evil";
}
