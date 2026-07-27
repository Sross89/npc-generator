export const MODULE_ID = "npc-generator";

export const CONTENT_LIBRARY_MODULE_ID = "wormsworth-content-library";
export const CONTENT_LIBRARY_PACKS = {
  TEMPLATES: `${CONTENT_LIBRARY_MODULE_ID}.templates`,
  ITEMS: `${CONTENT_LIBRARY_MODULE_ID}.items`,
  TABLES: `${CONTENT_LIBRARY_MODULE_ID}.tables`
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
  TEMPLATE_SOURCES: "templateSources",
  TABLE_SOURCES: "tableSources",
  SETTINGS_MENU: "settingsMenu"
};

export const FLAGS = {
  TEMPLATE_NAME: "templateName",
  SPECIES_NAME: "speciesName"
};

export const GENERATED_FOLDER_NAME = "Generated NPCs";
