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
  "Star",
  "Gift",
  "Universe",
  "Work / University",
  "Hairy",
];

const roundOneWhite = [
  "Rolls",
  "Clothes / Accessories",
  "Young / New",
  "Game / Toy",
  "Round",
  "Loud",
];

const roundOneBlue = [
  "Wearable",
  "Kitchen",
  "Hot",
  "Built",
  "Recyclable",
  "Bathroom",
];

const roundOneYellow = ["Rare", "Swims", "Big", "Flys", "City", "Small"];

const roundOnePurple = [
  "With meat / Carnivore",
  "Fragile",
  "Vegetarian / Herbivore",
  "White",
  "Sweet",
  "Drinkable",
];

const roundTwoRed = [
  "Man",
  "Film",
  "Party",
  "Science Fiction",
  "Magic",
  "Creepy",
];

const roundTwoWhite = [
  "Art",
  "Medicine / Health",
  "Heavy",
  "Hobby",
  "Funny",
  "Holiday",
];

const roundTwoBlue = ["Body part", "Cuts", "Cold", "Tool", "Plastic", "Fast"];

const roundTwoYellow = [
  "Land",
  "Space Flight",
  "Wood",
  "Slips / Glides",
  "Zoo",
  "Book",
];

const roundTwoPurple = [
  "Junk Food",
  "Vacation",
  "Camping",
  "Black",
  "Orange",
  "Red",
];

// Category Icon Map

export const ENGLISH_ICONS = {
  Woman: <ImWoman />,
  Star: <BsFillStarFill />,
  Gift: <ImGift />,
  Universe: <IoPlanet />,
  Zauberer: <FaHatWizard />,
  Hairy: <GiFurBoot />,
  Rolls: <GiCartwheel />,
  "Clothes / Accessories": <GiClothes />,
  "Young / New": <FaBaby />,
  "Game / Toy": <FaGamepad />,
  Round: <GiCircle />,
  Loud: <GiMegaphone />,
  Wearable: <BsHandbagFill />,
  Kitchen: <GiCookingPot />,
  Hot: <GiFlamer />,
  Built: <IoBuild />,
  Recyclable: <GiRecycle />,
  Bathroom: <GiBathtub />,
  Rare: <IoDiamond />,
  Gesundheit: <FaHeartbeat />,
  Big: <GiElephant />,
  Flys: <GiCurlyWing />,
  City: <GiModernCity />,
  Small: <GiAnt />,
  "With meat / Carnivore": <GiSteak />,
  Fragile: <GiShatteredGlass />,
  "Vegetarian / Herbivore": <GiLeafSwirl />,
  White: <BsSnow />,
  Sweet: <FaCandyCane />,
  Drinkable: <BsCupStraw />,
  Man: <IoMan />,
  Film: <BsCameraReelsFill />,
  Party: <GiPartyPopper />,
  "Science Fiction": <GiSpaceship />,
  Magic: <ImMagicWand />,
  Creepy: <GiPumpkinMask />,
  Art: <GiPaintBrush />,
  "Medicine / Health": <GiPill />,
  Heavy: <GiWeight />,
  "Wird warm": <BsThermometerSun />,
  Funny: <FaRegLaughBeam />,
  Holiday: <GiPartyFlags />,
  Bodypart: <GiBodySwapping />,
  Cuts: <ImScissors />,
  Cold: <BsThermometerSnow />,
  Tool: <BsTools />,
  Plastic: <GiPlasticDuck />,
  Fast: <BsSpeedometer />,
  Land: <GiGlobe />,
  "Space Flight": <IoRocketSharp />,
  Wood: <GiWoodPile />,
  "Slips / Glides": <GiIceSkate />,
  Zoo: <GiLion />,
  Book: <GiBookCover />,
  "Junk Food": <IoFastFood />,
  Vacation: <GiPalmTree />,
  Camping: <FaCampground />,
  Black: <GiCat />,
  Orange: <FaCarrot />,
  Red: <GiCherry />,
  "Work / University": <MdWork />,
  Hobby: <GiWool />,
  Swims: <GiSharkFin />,
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
