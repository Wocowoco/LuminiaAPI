import { IDeityInfo } from "../deity-info.interface";

export class FenlaDeityInfo implements IDeityInfo{
  avatarUrl = "../../../assets/images/pantheon/fenla-avatar.png";
  iconUrl = "../../../assets/images/pantheon/fenla-icon.png";
  backgroundUrl = "../../../assets/images/decorations/pantheon-fenla.png";
  name = "Fen'La";
  pronoun = "Goddess";
  domains = "Nature, Hunt, Life, Earth, Poison";
  titles = ["Mother Nature"];
  gender = "Female";
  race = "Dryad";
  alignment = "Chaotic Good";
}
