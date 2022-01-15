import React from "react";

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

// No diacritics allowed
export const animalNames = [
  "Anglerfisch",
  "Albatross",
  "Antilope",
  "Bonobo",
  "Eintagsfliege",
  "Feldhase",
  "Flusspferd",
  "Fledermaus",
  "Flamingo",
  "Honigbiene",
  "Hammerhai",
  "Kaulquappe",
  "Lachsforelle",
  "Laubfrosch",
  "Languste",
  "Nashorn",
  "Opossum",
  "Ozeanschnecke",
  "Papagei",
  "Pelikan",
  "Riesenkrabbe",
  "Rotfuchs",
  "Salamander",
  "Schmetterling",
  "Seehund",
  "Seeschwalbe",
  "Turmfalke",
  "Totenkopfaffe",
  "Wachtel",
  "Weinbergschnecke",
  "Wildschwein",
  "Zwergmaus",
  "Zitronenfalter",
];

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

// Icons

export const categoryIcons = {
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

export const roundOneCategories = [
  roundOneRed,
  roundOneBlue,
  roundOneWhite,
  roundOneYellow,
  roundOnePurple,
];

export const roundTwoCategories = [
  roundTwoRed,
  roundTwoBlue,
  roundTwoWhite,
  roundTwoYellow,
  roundTwoPurple,
];

export const combinations = [
  ["red", "slate"],
  ["amber", "purple"],
  ["blue", "red"],
  ["purple", "slate"],
  ["blue", "amber"],
  ["amber", "red"],
  ["blue", "slate"],
  ["red", "purple"],
  ["slate", "amber"],
  ["purple", "blue"],
];

export const colorNumberMap = {
  red: 0,
  blue: 1,
  slate: 2,
  amber: 3,
  purple: 4,
};

export const catColorMap = {
  0: "bg-red-200 text-red-500 shadow-red-200 border-red-500",
  1: "bg-blue-200 text-blue-500 shadow-blue-200 border-blue-500",
  2: "bg-slate-200 text-slate-600 shadow-slate-200 border-slate-500",
  3: "bg-amber-200 text-amber-600 shadow-amber-200 border-amber-500",
  4: "bg-purple-200 text-purple-500 shadow-purple-200 border-purple-500",
};
