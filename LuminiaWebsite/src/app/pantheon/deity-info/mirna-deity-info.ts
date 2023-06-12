import { IDeityInfo } from "../deity-info.interface";

export class MirnaDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/unknown.png";
  iconUrl = "../../../assets/images/pantheon/mirna-icon.png";
  name = "Mirna";
  pronoun = "Goddess";
  domains = "Balance, Luck, Dreams, Nightmares, Force";
  titles = ["Goddess of Gods", "Lady Luck"];
  gender = "Female";
  race = "Human";
  alignment = "True Neutral";
}
