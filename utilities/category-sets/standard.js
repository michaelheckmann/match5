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
  "Frau",
  "Berühmtheit",
  "Geschenk",
  "Universum",
  "Arbeit / Uni",
  "Haarig / Pelzig",
];

const roundOneWhite = [
  "Fährt / Rollt",
  "Kleidung / Accessoires",
  "Jung / Neu",
  "Spielzeug / Spiel",
  "Rund",
  "Laut",
];

const roundOneBlue = [
  "Tragbar",
  "Küche",
  "Heiß",
  "Gebaut",
  "Recyclebar",
  "Badezimmer",
];

const roundOneYellow = [
  "Selten",
  "Schwimmt",
  "Groß",
  "Fliegt",
  "Stadt",
  "Klein",
];

const roundOnePurple = [
  "Mit Fleisch / Fleischfresser",
  "Zerbrechlich",
  "Vegetarisch / Pflanzenfresser",
  "Weiß",
  "Süß",
  "Trinkbar",
];

const roundTwoRed = [
  "Mann",
  "Film",
  "Party",
  "Science Fiction",
  "Magisch",
  "Gruselig",
];

const roundTwoWhite = [
  "Kunst",
  "Arzneimittel / Gesundheit",
  "Schwer",
  "Hobby",
  "Lustig",
  "Feiertag",
];

const roundTwoBlue = [
  "Körperteil",
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

export const STANDARD_ICONS = {
  Frau: <ImWoman />,
  Berühmtheit: <BsFillStarFill />,
  Geschenk: <ImGift />,
  Universum: <IoPlanet />,
  Zauberer: <FaHatWizard />,
  "Haarig / Pelzig": <GiFurBoot />,
  "Fährt / Rollt": <GiCartwheel />,
  "Kleidung / Accessoires": <GiClothes />,
  "Jung / Neu": <FaBaby />,
  "Spielzeug / Spiel": <FaGamepad />,
  Rund: <GiCircle />,
  Laut: <GiMegaphone />,
  Tragbar: <BsHandbagFill />,
  Küche: <GiCookingPot />,
  Heiß: <GiFlamer />,
  Gebaut: <IoBuild />,
  Recyclebar: <GiRecycle />,
  Badezimmer: <GiBathtub />,
  Selten: <IoDiamond />,
  Gesundheit: <FaHeartbeat />,
  Groß: <GiElephant />,
  Fliegt: <GiCurlyWing />,
  Stadt: <GiModernCity />,
  Klein: <GiAnt />,
  "Mit Fleisch / Fleischfresser": <GiSteak />,
  Zerbrechlich: <GiShatteredGlass />,
  "Vegetarisch / Pflanzenfresser": <GiLeafSwirl />,
  Weiß: <BsSnow />,
  Süß: <FaCandyCane />,
  Trinkbar: <BsCupStraw />,
  Mann: <IoMan />,
  Film: <BsCameraReelsFill />,
  Party: <GiPartyPopper />,
  "Science Fiction": <GiSpaceship />,
  Magisch: <ImMagicWand />,
  Gruselig: <GiPumpkinMask />,
  Kunst: <GiPaintBrush />,
  "Arzneimittel / Gesundheit": <GiPill />,
  Schwer: <GiWeight />,
  "Wird warm": <BsThermometerSun />,
  Lustig: <FaRegLaughBeam />,
  Feiertag: <GiPartyFlags />,
  Körperteil: <GiBodySwapping />,
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

export const STANDARD_ONE = [
  roundOneRed,
  roundOneBlue,
  roundOneWhite,
  roundOneYellow,
  roundOnePurple,
];

export const STANDARD_TWO = [
  roundTwoRed,
  roundTwoBlue,
  roundTwoWhite,
  roundTwoYellow,
  roundTwoPurple,
];
