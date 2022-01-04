import { emojis } from "./constants";

export default function getEmoji(name, id = 0) {
  let s = id;
  Array(name.length)
    .fill()
    .forEach((_, i) => {
      s += name.charCodeAt(i);
    });
  return `/emojis/${emojis[s % emojis.length]}`;
}
