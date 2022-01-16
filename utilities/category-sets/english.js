import {
  GiFurBoot,
  GiCartwheel,
  GiClothes,
  GiCircle,
  GiMegaphone,
  GiCookingPot,
  GiFlamer,
  GiRecycle,
  GiBathtub,
  GiElephant,
  GiCurlyWing,
  GiModernCity,
  GiAnt,
  GiSteak,
  GiShatteredGlass,
  GiLeafSwirl,
  GiPartyPopper,
  GiSpaceship,
  GiPumpkinMask,
  GiPaintBrush,
  GiPill,
  GiWeight,
  GiPartyFlags,
  GiBodySwapping,
  GiPlasticDuck,
  GiGlobe,
  GiWoodPile,
  GiIceSkate,
  GiLion,
  GiBookCover,
  GiPalmTree,
  GiCat,
  GiCherry,
  GiWool,
  GiSharkFin,
} from "react-icons/gi";

import { ImWoman, ImGift, ImMagicWand, ImScissors } from "react-icons/im";

import {
  BsFillStarFill,
  BsHandbagFill,
  BsSnow,
  BsCupStraw,
  BsCameraReelsFill,
  BsThermometerSun,
  BsThermometerSnow,
  BsTools,
  BsSpeedometer,
} from "react-icons/bs";

import {
  IoPlanet,
  IoBuild,
  IoDiamond,
  IoMan,
  IoRocketSharp,
  IoFastFood,
} from "react-icons/io5";

import {
  FaHatWizard,
  FaBaby,
  FaGamepad,
  FaHeartbeat,
  FaCandyCane,
  FaRegLaughBeam,
  FaCampground,
  FaCarrot,
} from "react-icons/fa";

import { MdWork } from "react-icons/md";

//   Category Names

const roundOneRed = [
  "Woman",
  "Berühmtheit",
  "Geschenk",
  "Universum",
  "Arbeit / Uni",
  "Haarig / Pelzig",
];

const roundOneWhite = [
  "Rolling",
  "Kleidung / Accessoires",
  "Jung / Neu",
  "Spielzeug / Spiel",
  "Rund",
  "Laut",
];

const roundOneBlue = [
  "Wearable",
  "Küche",
  "Heiß",
  "Gebaut",
  "Recyclebar",
  "Badezimmer",
];

const roundOneYellow = ["Rare", "Schwimmt", "Groß", "Fliegt", "Stadt", "Klein"];

const roundOnePurple = [
  "With meat / Carnivore",
  "Zerbrechlich",
  "Vegetarisch / Pflanzenfresser",
  "Weiß",
  "Süß",
  "Trinkbar",
];

const roundTwoRed = [
  "Man",
  "Film",
  "Party",
  "Science Fiction",
  "Magisch",
  "Gruselig",
];

const roundTwoWhite = [
  "Art",
  "Arzneimittel / Gesundheit",
  "Schwer",
  "Hobby",
  "Lustig",
  "Feiertag",
];

const roundTwoBlue = [
  "Body part",
  "Schneidet",
  "Kalt",
  "Werkzeug",
  "Kunststoff",
  "Schnell",
];

const roundTwoYellow = [
  "Land",
  "Raumfahrt",
  "Holz",
  "Rutscht / Gleitet",
  "Zoo",
  "Buch",
];

const roundTwoPurple = [
  "Junk Food",
  "Urlaub",
  "Camping",
  "Schwarz",
  "Orange",
  "Rot",
];

// Category Icon Map

export const ENGLISH_ICONS = {
  Woman: <ImWoman />,
  Berühmtheit: <BsFillStarFill />,
  Geschenk: <ImGift />,
  Universum: <IoPlanet />,
  Zauberer: <FaHatWizard />,
  "Haarig / Pelzig": <GiFurBoot />,
  Rolling: <GiCartwheel />,
  "Kleidung / Accessoires": <GiClothes />,
  "Jung / Neu": <FaBaby />,
  "Spielzeug / Spiel": <FaGamepad />,
  Rund: <GiCircle />,
  Laut: <GiMegaphone />,
  Wearable: <BsHandbagFill />,
  Küche: <GiCookingPot />,
  Heiß: <GiFlamer />,
  Gebaut: <IoBuild />,
  Recyclebar: <GiRecycle />,
  Badezimmer: <GiBathtub />,
  Rare: <IoDiamond />,
  Gesundheit: <FaHeartbeat />,
  Groß: <GiElephant />,
  Fliegt: <GiCurlyWing />,
  Stadt: <GiModernCity />,
  Klein: <GiAnt />,
  "With meat / Carnivore": <GiSteak />,
  Zerbrechlich: <GiShatteredGlass />,
  "Vegetarisch / Pflanzenfresser": <GiLeafSwirl />,
  Weiß: <BsSnow />,
  Süß: <FaCandyCane />,
  Trinkbar: <BsCupStraw />,
  Man: <IoMan />,
  Film: <BsCameraReelsFill />,
  Party: <GiPartyPopper />,
  "Science Fiction": <GiSpaceship />,
  Magisch: <ImMagicWand />,
  Gruselig: <GiPumpkinMask />,
  Art: <GiPaintBrush />,
  "Arzneimittel / Gesundheit": <GiPill />,
  Schwer: <GiWeight />,
  "Wird warm": <BsThermometerSun />,
  Lustig: <FaRegLaughBeam />,
  Feiertag: <GiPartyFlags />,
  Bodypart: <GiBodySwapping />,
  Schneidet: <ImScissors />,
  Kalt: <BsThermometerSnow />,
  Werkzeug: <BsTools />,
  Kunststoff: <GiPlasticDuck />,
  Schnell: <BsSpeedometer />,
  Land: <GiGlobe />,
  Raumfahrt: <IoRocketSharp />,
  Holz: <GiWoodPile />,
  "Rutscht / Gleitet": <GiIceSkate />,
  Zoo: <GiLion />,
  Buch: <GiBookCover />,
  "Junk Food": <IoFastFood />,
  Urlaub: <GiPalmTree />,
  Camping: <FaCampground />,
  Schwarz: <GiCat />,
  Orange: <FaCarrot />,
  Rot: <GiCherry />,
  "Arbeit / Uni": <MdWork />,
  Hobby: <GiWool />,
  Schwimmt: <GiSharkFin />,
};

export const ENGLISH_ONE = [
  roundOneRed,
  roundOneBlue,
  roundOneWhite,
  roundOneYellow,
  roundOnePurple,
];

export const ENGLISH_TWO = [
  roundTwoRed,
  roundTwoBlue,
  roundTwoWhite,
  roundTwoYellow,
  roundTwoPurple,
];
