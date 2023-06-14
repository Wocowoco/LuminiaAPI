import { IDeityInfo } from "../deity-info.interface";

export class CaraDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/cara-avatar.png";
  iconUrl = "../../../assets/images/pantheon/cara-icon.png";
  name = "Cara";
  pronoun = "Goddess";
  domains = "Light, Justice, Warmth, Radiance";
  titles = ["Lady Light", "Her Radiance"];
  gender = "Female";
  race = "Aasimar";
  alignment = "Lawful Good";
}
