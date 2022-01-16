import {
  ENGLISH_ONE,
  ENGLISH_TWO,
  ENGLISH_ICONS,
} from "./category-sets/english";
import {
  STANDARD_ONE,
  STANDARD_TWO,
  STANDARD_ICONS,
} from "./category-sets/standard";

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

export const roundOneCategorySets = [STANDARD_ONE, ENGLISH_ONE];

export const roundTwoCategorySets = [STANDARD_TWO, ENGLISH_TWO];

export const categoryIcons = { ...STANDARD_ICONS, ...ENGLISH_ICONS };

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
