import { SETTINGS } from "../constants.js";
import { getSourceIds } from "./settings.js";

/** Pools every Species (race) item across every linked "Species" compendium. */
export async function listSpecies() {
  const packIds = getSourceIds(SETTINGS.SPECIES_SOURCES);
  const species = [];
  for (const packId of packIds) {
    const pack = game.packs.get(packId);
    if (!pack) continue;
    const index = await pack.getIndex();
    for (const entry of index) {
      if (entry.type !== "race") continue;
      species.push({ uuid: `Compendium.${packId}.Item.${entry._id}`, name: entry.name });
    }
  }
  return species;
}
