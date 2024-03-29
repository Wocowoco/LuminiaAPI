import { IDeityInfo } from "../deity-info.interface";

export class VaknorDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/vaknor-avatar.png";
  iconUrl = "../../../assets/images/pantheon/vaknor-icon.png";
  backgroundUrl = "../../../assets/images/decorations/pantheon-vaknor.png";
  name = "Vak'Nor";
  pronoun = "God";
  domains = "Deception, Plagues, Psychic, Acid, Thieves";
  titles = ["The Plaguemaster", "The Masked One"];
  gender = "Male";
  race = "Drow";
  alignment = "Neutral Evil";
}
