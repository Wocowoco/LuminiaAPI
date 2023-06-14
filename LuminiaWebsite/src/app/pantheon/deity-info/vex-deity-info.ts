import { IDeityInfo } from "../deity-info.interface";

export class VexDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/vex-avatar.png";
  iconUrl = "../../../assets/images/pantheon/vex-icon.png";
  name = "Vex";
  pronoun = "Goddess";
  domains = "Death, Necromancy, Darkness";
  titles = ["The Reaper"];
  gender = "Female";
  race = "Goblin";
  alignment = "Lawful Evil";
}
