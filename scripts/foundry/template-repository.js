import { SETTINGS } from "../constants.js";
import { getSourceIds } from "./settings.js";

/** Pools every Actor across every linked "Templates" compendium. */
export async function listTemplates() {
  const packIds = getSourceIds(SETTINGS.TEMPLATE_SOURCES);
  const templates = [];
  for (const packId of packIds) {
    const pack = game.packs.get(packId);
    if (!pack) continue;
    const index = await pack.getIndex();
    for (const entry of index) {
      templates.push({ uuid: `Compendium.${packId}.Actor.${entry._id}`, name: entry.name });
    }
  }
  return templates;
}
