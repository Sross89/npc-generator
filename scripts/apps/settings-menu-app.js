import { MODULE_ID, PACKS, SETTINGS } from "../constants.js";
import { listCompendiums } from "../foundry/compendium-index.js";
import { getSourceIds, setSourceIds } from "../foundry/settings.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const CATEGORIES = [
  { key: SETTINGS.SPELL_SOURCES, labelKey: "NPC_GENERATOR.Settings.Spells" },
  { key: SETTINGS.ITEM_SOURCES, labelKey: "NPC_GENERATOR.Settings.StandardItems" },
  { key: SETTINGS.SPECIES_SOURCES, labelKey: "NPC_GENERATOR.Settings.Species" }
];

/**
 * GM-facing settings menu: which installed Item compendiums supply Spells, Standard
 * Items, and Species for the generator. Multiple compendiums per category are allowed
 * and pooled together with no deduplication -- overlaps are the DM's call, not ours.
 */
export class SettingsMenuApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "npc-generator-settings",
    tag: "form",
    classes: ["npc-generator", "settings-menu"],
    window: { title: "NPC_GENERATOR.Settings.MenuLabel", icon: "fa-solid fa-people-group" },
    position: { width: 480, height: "auto" },
    form: { handler: SettingsMenuApp.#onSubmit, closeOnSubmit: true }
  };

  static PARTS = {
    form: { template: `modules/${MODULE_ID}/templates/settings-menu.hbs` },
    footer: { template: "templates/generic/form-footer.hbs" }
  };

  /** @override */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    if (partId === "form") {
      const availablePacks = listCompendiums("Item", { excludePackIds: [PACKS.TRINKET_ITEMS] });
      context.categories = CATEGORIES.map(category => {
        const selected = new Set(getSourceIds(category.key));
        return {
          key: category.key,
          label: game.i18n.localize(category.labelKey),
          options: availablePacks.map(pack => ({ ...pack, checked: selected.has(pack.id) }))
        };
      });
    }

    if (partId === "footer") {
      context.buttons = [{ type: "submit", icon: "fas fa-save", label: "SETTINGS.Save" }];
    }

    return context;
  }

  static async #onSubmit(event, form, formData) {
    const expanded = foundry.utils.expandObject(formData.object);
    for (const category of CATEGORIES) {
      const pickedIds = Object.values(expanded[category.key] ?? {});
      await setSourceIds(category.key, pickedIds);
    }
  }
}
