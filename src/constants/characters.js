import hoodie from "../assets/3d/characters/char_hoodie.glb";
import casual from "../assets/3d/characters/char_casual.glb";
import business from "../assets/3d/characters/char_business.glb";

// Quaternius "Ultimate Modular Men" characters (CC0) via Poly Pizza.
// All three share the same rig and clip names.
export const characters = [
  { id: "hoodie", name: "Hoodie", url: hoodie },
  { id: "casual", name: "Casual", url: casual },
  { id: "business", name: "Business", url: business },
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
