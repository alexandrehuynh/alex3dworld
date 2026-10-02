import hoodie from "../assets/3d/characters/char_hoodie.glb";
import casual from "../assets/3d/characters/char_casual.glb";
import business from "../assets/3d/characters/char_business.glb";
import womanHoodie from "../assets/3d/characters/woman_hoodie.glb";
import womanCasual from "../assets/3d/characters/woman_casual.glb";
import womanBusiness from "../assets/3d/characters/woman_business.glb";

// Quaternius "Ultimate Modular Men" and "Ultimate Modular Women" characters
// (CC0) via Poly Pizza. All six share the same rig and clip names.
export const characters = [
  { id: "hoodie", name: "Hoodie", group: "Male", url: hoodie },
  { id: "casual", name: "Casual", group: "Male", url: casual },
  { id: "business", name: "Business", group: "Male", url: business },
  { id: "w-hoodie", name: "Hoodie", group: "Female", url: womanHoodie },
  { id: "w-casual", name: "Casual", group: "Female", url: womanCasual },
  { id: "w-business", name: "Business", group: "Female", url: womanBusiness },
];

export const CLIPS = {
  idle: "CharacterArmature|Idle",
  walk: "CharacterArmature|Walk",
  run: "CharacterArmature|Run",
  wave: "CharacterArmature|Wave",
  interact: "CharacterArmature|Interact",
};

const STORAGE_KEY = "portfolio.character";

export const loadCharacterId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const saveCharacterId = (id) => {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // storage blocked (private mode etc.): the choice just won't persist
  }
};
