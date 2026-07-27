import { SETTINGS } from "../constants.js";
import { getSourceIds } from "./settings.js";

/** Pools every linked "Table Sources" compendium and returns the first table matching `name`. */
async function getTableByName(name) {
  for (const packId of getSourceIds(SETTINGS.TABLE_SOURCES)) {
    const pack = game.packs.get(packId);
    if (!pack) continue;
    const index = await pack.getIndex();
    const entry = index.find(e => e.name === name);
    if (entry) return pack.getDocument(entry._id);
  }
  return null;
}

export async function listTableNames() {
  const names = [];
  for (const packId of getSourceIds(SETTINGS.TABLE_SOURCES)) {
    const pack = game.packs.get(packId);
    if (!pack) continue;
    const index = await pack.getIndex();
    for (const entry of index) names.push(entry.name);
  }
  return names;
}

/** Draws a single result's text. Silent — never posts to chat. Returns "" if the table is missing/empty. */
export async function drawText(tableName) {
  const table = await getTableByName(tableName);
  if (!table) return "";
  const { results } = await table.draw({ displayChat: false });
  return results[0]?.description ?? "";
}

/**
 * Draws a single result that's expected to reference a real Item document (e.g. the
 * Trinkets & Oddities table). Falls back to a text-only result if the drawn entry
 * isn't actually a document reference.
 */
export async function drawDocument(tableName) {
  const table = await getTableByName(tableName);
  if (!table) return null;
  const { results } = await table.draw({ displayChat: false });
  const result = results[0];
  if (!result) return null;

  const uuid = result.documentUuid
    ?? (result.documentCollection && result.documentId ? `${result.documentCollection}.${result.documentId}` : null);
  if (!uuid) return { uuid: null, name: result.description };

  const doc = await fromUuid(uuid);
  return doc ? { uuid: doc.uuid, name: doc.name } : { uuid, name: result.description };
}
