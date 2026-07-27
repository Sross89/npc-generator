import { MODULE_ID, SETTINGS, CONTENT_LIBRARY_PACKS } from "../constants.js";

// Categories the content library itself supplies default to the library's own packs, so
// a fresh install works with zero configuration. Spells/Standard Items/Species aren't
// provided by the library -- those stay empty until the DM links something themselves.
const SOURCE_SETTING_DEFAULTS = {
  [SETTINGS.SPELL_SOURCES]: [],
  [SETTINGS.ITEM_SOURCES]: [],
  [SETTINGS.SPECIES_SOURCES]: [],
  [SETTINGS.TEMPLATE_SOURCES]: [CONTENT_LIBRARY_PACKS.TEMPLATES],
  [SETTINGS.TABLE_SOURCES]: [CONTENT_LIBRARY_PACKS.TABLES]
};

/** @param {typeof foundry.applications.api.ApplicationV2} SettingsMenuApp injected to avoid a circular import */
export function registerSettings(SettingsMenuApp) {
  // Which compendium packs supply Spells / Standard Items / Species / Templates / Roll
  // Tables for generation. World-scoped: this describes how the whole game table
  // generates NPCs, not a personal client preference. Each is an array of compendium
  // collection ids (e.g. "dnd5e.items").
  for (const [key, defaultValue] of Object.entries(SOURCE_SETTING_DEFAULTS)) {
    game.settings.register(MODULE_ID, key, {
      scope: "world",
      config: false,
      type: Array,
      default: defaultValue
    });
  }

  game.settings.registerMenu(MODULE_ID, SETTINGS.SETTINGS_MENU, {
    name: "NPC_GENERATOR.Settings.MenuName",
    label: "NPC_GENERATOR.Settings.MenuLabel",
    hint: "NPC_GENERATOR.Settings.MenuHint",
    icon: "fa-solid fa-people-group",
    type: SettingsMenuApp,
    restricted: true
  });
}

export function getSourceIds(category) {
  return game.settings.get(MODULE_ID, category);
}

export function setSourceIds(category, ids) {
  return game.settings.set(MODULE_ID, category, ids);
}
