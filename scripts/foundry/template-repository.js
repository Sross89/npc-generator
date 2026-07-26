import { PACKS } from "../constants.js";

export async function listTemplates() {
  const pack = game.packs.get(PACKS.TEMPLATES);
  const index = await pack.getIndex();
  return index.map(entry => ({
    uuid: `Compendium.${PACKS.TEMPLATES}.Actor.${entry._id}`,
    name: entry.name
  }));
}

export async function getTemplateActor(uuid) {
  return fromUuid(uuid);
}
