import { TABLE_NAMES } from "../constants.js";
import { rollAbilityScores } from "./ability-scores.js";
import { resolveNameTable } from "./name-resolution.js";
import { createInventoryRow } from "./generation-state.js";

/**
 * Orchestrates a full generation pass over a GenerationState, mutating it in place.
 * Every Foundry-touching operation is reached only through the injected `repositories`
 * collaborators (rollTableRepository / itemSourceRepository / rollDie) — this file itself
 * never calls a `game.*` API, so it can be exercised with plain fakes.
 */
export async function rollAbilities(state, { rollDie }) {
  state.abilities = rollAbilityScores(rollDie);
  return state;
}

export async function rollFlavor(state, { rollTableRepository }) {
  state.quirk = await rollTableRepository.drawText(TABLE_NAMES.QUIRKS);
  state.ideal = await rollTableRepository.drawText(TABLE_NAMES.IDEALS);
  state.bond = await rollTableRepository.drawText(TABLE_NAMES.BONDS);
  state.flaw = await rollTableRepository.drawText(TABLE_NAMES.FLAWS);
  return state;
}

export async function rollName(state, { rollTableRepository }) {
  const availableTableNames = await rollTableRepository.listTableNames();
  const tableName = resolveNameTable(state.speciesName, availableTableNames);
  state.name = await rollTableRepository.drawText(tableName);
  return state;
}

export async function rollInventory(state, { itemSourceRepository }, { standardCount = 2, trinketCount = 1 } = {}) {
  const rows = [];
  for (let i = 0; i < standardCount; i++) {
    const item = await itemSourceRepository.drawStandardItem();
    if (item) rows.push(createInventoryRow({ ...item, source: "standard" }));
  }
  for (let i = 0; i < trinketCount; i++) {
    const item = await itemSourceRepository.drawTrinket();
    if (item) rows.push(createInventoryRow({ ...item, source: "trinket" }));
  }
  state.inventory = rows;
  return state;
}

export async function generateNpc(state, repositories, options) {
  await rollAbilities(state, repositories);
  await rollFlavor(state, repositories);
  await rollName(state, repositories);
  await rollInventory(state, repositories, options);
  return state;
}
