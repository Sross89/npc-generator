import { SETTINGS, TABLE_NAMES } from "../constants.js";
import { getSourceIds } from "./settings.js";
import { drawDocument } from "./rolltable-repository.js";

/** Pools every Item across every linked "Standard Items" compendium and picks one uniformly at random. */
export async function drawStandardItem() {
  const packIds = getSourceIds(SETTINGS.ITEM_SOURCES);
  const candidates = [];
  for (const packId of packIds) {
    const pack = game.packs.get(packId);
    if (!pack) continue;
    const index = await pack.getIndex();
    for (const entry of index) {
      candidates.push({ uuid: `Compendium.${packId}.Item.${entry._id}`, name: entry.name });
    }
  }
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Draws from the module's own Trinkets & Oddities table (a Document-result table pointing into trinket-items). */
export async function drawTrinket() {
  return drawDocument(TABLE_NAMES.TRINKETS);
}
