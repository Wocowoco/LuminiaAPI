import { IDeityInfo } from "../deity-info.interface";

export class KazDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/kaz-avatar.png";
  iconUrl = "../../../assets/images/pantheon/kaz-icon.png";
  name = "Kaz";
  pronoun = "God";
  domains = "Wealth, Trade, Protection, Healing";
  titles = ["Protector","Merchant"];
  gender = "Male";
  race = "Tabaxi";
  alignment = "Lawful Good";
}
