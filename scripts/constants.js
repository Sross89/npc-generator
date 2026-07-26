export const MODULE_ID = "npc-generator";

export const PACKS = {
  TEMPLATES: `${MODULE_ID}.npc-templates`,
  TRINKET_ITEMS: `${MODULE_ID}.trinket-items`,
  ROLL_TABLES: `${MODULE_ID}.roll-tables`
};

export const TABLE_NAMES = {
  QUIRKS: "Quirks",
  IDEALS: "Ideals",
  BONDS: "Bonds",
  FLAWS: "Flaws",
  TRINKETS: "Trinkets & Oddities",
  NAMES_GENERIC: "Names — Generic",
  namesForSpecies(speciesName) {
    return `Names — ${speciesName}`;
  }
};

export const SETTINGS = {
  SPELL_SOURCES: "spellSources",
  ITEM_SOURCES: "itemSources",
  SPECIES_SOURCES: "speciesSources",
  SETTINGS_MENU: "settingsMenu"
};

export const FLAGS = {
  TEMPLATE_NAME: "templateName",
  SPECIES_NAME: "speciesName"
};

export const GENERATED_FOLDER_NAME = "Generated NPCs";
