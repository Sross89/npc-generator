import { MODULE_ID, CONTENT_LIBRARY_PACKS, SETTINGS } from "../constants.js";
import { listCompendiums } from "../foundry/compendium-index.js";
import { getSourceIds, setSourceIds } from "../foundry/settings.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const CATEGORIES = [
  { key: SETTINGS.SPELL_SOURCES, labelKey: "NPC_GENERATOR.Settings.Spells", documentType: "Item", exclude: [CONTENT_LIBRARY_PACKS.ITEMS] },
  { key: SETTINGS.ITEM_SOURCES, labelKey: "NPC_GENERATOR.Settings.StandardItems", documentType: "Item", exclude: [CONTENT_LIBRARY_PACKS.ITEMS] },
  { key: SETTINGS.SPECIES_SOURCES, labelKey: "NPC_GENERATOR.Settings.Species", documentType: "Item", exclude: [] },
  { key: SETTINGS.TEMPLATE_SOURCES, labelKey: "NPC_GENERATOR.Settings.Templates", documentType: "Actor", exclude: [] },
  { key: SETTINGS.TABLE_SOURCES, labelKey: "NPC_GENERATOR.Settings.TableSources", documentType: "RollTable", exclude: [] }
];

/**
 * GM-facing settings menu: which installed compendiums supply Spells, Standard Items,
 * Species, Templates, and Roll Tables for the generator. Multiple compendiums per
 * category are allowed and pooled together with no deduplication -- overlaps are the
 * DM's call, not ours. Templates and Roll Tables default to Wormsworth's Content
 * Library's own packs (see foundry/settings.js); the rest default empty.
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
      context.categories = CATEGORIES.map(category => {
        const availablePacks = listCompendiums(category.documentType, { excludePackIds: category.exclude });
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
