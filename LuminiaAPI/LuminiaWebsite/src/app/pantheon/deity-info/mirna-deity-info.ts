import { IDeityInfo } from "../deity-info.interface";

export class MirnaDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/mirna-avatar.png";
  iconUrl = "../../../assets/images/pantheon/mirna-icon.png";
  backgroundUrl = "../../../assets/images/decorations/pantheon-mirna.png";
  name = "Mirna";
  pronoun = "Goddess";
  domains = "Balance, Luck, Dreams, Nightmares, Force";
  titles = ["Goddess of Gods", "Lady Luck"];
  gender = "Female";
  race = "Human";
  alignment = "True Neutral";
}
