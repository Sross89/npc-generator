import { MODULE_ID, SETTINGS } from "../constants.js";

const SOURCE_SETTING_KEYS = [SETTINGS.SPELL_SOURCES, SETTINGS.ITEM_SOURCES, SETTINGS.SPECIES_SOURCES];

/** @param {typeof foundry.applications.api.ApplicationV2} SettingsMenuApp injected to avoid a circular import */
export function registerSettings(SettingsMenuApp) {
  // Which compendium packs supply Spells / Standard Items / Species for generation.
  // World-scoped: this describes how the whole game table generates NPCs, not a personal
  // client preference. Each is an array of compendium collection ids (e.g. "dnd5e.items").
  for (const key of SOURCE_SETTING_KEYS) {
    game.settings.register(MODULE_ID, key, {
      scope: "world",
      config: false,
      type: Array,
      default: []
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
