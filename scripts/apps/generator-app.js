import { MODULE_ID, TABLE_NAMES } from "../constants.js";
import * as templateRepository from "../foundry/template-repository.js";
import * as rollTableRepository from "../foundry/rolltable-repository.js";
import * as itemSourceRepository from "../foundry/item-source-repository.js";
import * as speciesRepository from "../foundry/species-repository.js";
import { createActorFromState } from "../foundry/actor-factory.js";
import { createGenerationState, createInventoryRow } from "../domain/generation-state.js";
import { rollAbilityScore } from "../domain/ability-scores.js";
import { generateNpc, rollName } from "../domain/npc-generation.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const FLAVOR_TABLES = {
  quirk: TABLE_NAMES.QUIRKS,
  ideal: TABLE_NAMES.IDEALS,
  bond: TABLE_NAMES.BONDS,
  flaw: TABLE_NAMES.FLAWS
};

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

const REPOSITORIES = { rollDie: rollD6, rollTableRepository, itemSourceRepository };

/**
 * The "Generate NPC" window. Owns a single in-progress GenerationState (domain layer);
 * every reroll/edit mutates that plain object and re-renders. "Create Actor" hands the
 * finished state to the actor-factory (data-access layer) and closes.
 */
export class GeneratorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "npc-generator-app",
    classes: ["npc-generator", "generator"],
    window: { title: "NPC_GENERATOR.Generator.Title", icon: "fa-solid fa-user-plus", resizable: true },
    position: { width: 560, height: "auto" },
    actions: {
      reroll: GeneratorApp.#onReroll,
      rerollAll: GeneratorApp.#onRerollAll,
      removeRow: GeneratorApp.#onRemoveRow,
      addItem: GeneratorApp.#onAddItem,
      createActor: GeneratorApp.#onCreateActor
    }
  };

  static PARTS = {
    body: { template: `modules/${MODULE_ID}/templates/generator-app.hbs` }
  };

  #templates = [];
  #species = [];
  state = null;

  /** @override */
  async _prepareContext(options) {
    this.#templates = await templateRepository.listTemplates();
    this.#species = await speciesRepository.listSpecies();

    if (!this.state && this.#templates.length) {
      await this.#selectTemplate(this.#templates[0].uuid, { render: false });
    }

    return {
      templates: this.#templates,
      species: [
        { uuid: "", name: game.i18n.localize("NPC_GENERATOR.Generator.NoSpecies") },
        ...this.#species
      ],
      selectedTemplateUuid: this.state?.templateUuid ?? "",
      selectedSpeciesUuid: this.state?.speciesUuid ?? "",
      state: this.state
    };
  }

  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options);

    this.element.querySelector('[name="templateUuid"]')
      ?.addEventListener("change", event => this.#selectTemplate(event.target.value));
    this.element.querySelector('[name="speciesUuid"]')
      ?.addEventListener("change", event => this.#selectSpecies(event.target.value || null));

    for (const input of this.element.querySelectorAll("[data-field]")) {
      input.addEventListener("change", event => this.#onFieldInput(event));
    }

    const dropzone = this.element.querySelector(".inventory-list");
    if (dropzone) {
      dropzone.addEventListener("dragover", event => event.preventDefault());
      dropzone.addEventListener("drop", event => this.#onDropItem(event));
    }
  }

  async #selectTemplate(uuid, { render = true } = {}) {
    const templateMeta = this.#templates.find(t => t.uuid === uuid);
    this.state = createGenerationState({
      templateUuid: uuid,
      templateName: templateMeta?.name,
      speciesUuid: this.state?.speciesUuid ?? null,
      speciesName: this.state?.speciesName ?? null
    });
    await generateNpc(this.state, REPOSITORIES);
    if (render) this.render();
  }

  async #selectSpecies(uuid) {
    const species = this.#species.find(s => s.uuid === uuid);
    this.state.speciesUuid = uuid;
    this.state.speciesName = species?.name ?? null;
    await rollName(this.state, REPOSITORIES);
    this.render();
  }

  #onFieldInput(event) {
    const field = event.target.dataset.field;
    if (field.startsWith("ability.")) {
      const key = field.split(".")[1];
      this.state.abilities[key] = Number(event.target.value) || 0;
    } else {
      this.state[field] = event.target.value;
    }
  }

  async #onDropItem(event) {
    event.preventDefault();
    const data = TextEditor.implementation.getDragEventData(event);
    if (data?.type !== "Item") return;
    const doc = await fromUuid(data.uuid);
    if (!doc) return;
    this.state.inventory.push(createInventoryRow({ uuid: doc.uuid, name: doc.name, source: "manual" }));
    this.render();
  }

  static async #onReroll(event, target) {
    const field = target.dataset.field;
    const row = target.dataset.row;

    if (row) {
      const entry = this.state.inventory.find(r => r.key === row);
      if (!entry) return;
      const item = entry.source === "trinket"
        ? await itemSourceRepository.drawTrinket()
        : await itemSourceRepository.drawStandardItem();
      if (item) Object.assign(entry, item);
    } else if (field === "name") {
      await rollName(this.state, REPOSITORIES);
    } else if (field in FLAVOR_TABLES) {
      this.state[field] = await rollTableRepository.drawText(FLAVOR_TABLES[field]);
    } else if (field?.startsWith("ability.")) {
      const key = field.split(".")[1];
      this.state.abilities[key] = rollAbilityScore(rollD6);
    }
    this.render();
  }

  static async #onRerollAll(event, target) {
    await generateNpc(this.state, REPOSITORIES);
    this.render();
  }

  static async #onRemoveRow(event, target) {
    this.state.inventory = this.state.inventory.filter(r => r.key !== target.dataset.row);
    this.render();
  }

  static async #onAddItem(event, target) {
    const item = await itemSourceRepository.drawStandardItem();
    if (item) this.state.inventory.push(createInventoryRow({ ...item, source: "standard" }));
    this.render();
  }

  static async #onCreateActor(event, target) {
    const actor = await createActorFromState(this.state);
    this.close();
    actor.sheet.render(true);
  }
}
