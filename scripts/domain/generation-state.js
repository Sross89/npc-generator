/**
 * Plain-data shape of an NPC mid-generation. Nothing in this file talks to Foundry —
 * it is what the generator app renders and what the actor-factory (data-access layer)
 * eventually turns into a real Actor document.
 */
export function createGenerationState({ templateUuid, templateName, speciesUuid = null, speciesName = null }) {
  return {
    templateUuid,
    templateName,
    speciesUuid,
    speciesName,
    name: "",
    quirk: "",
    ideal: "",
    bond: "",
    flaw: "",
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    inventory: []
  };
}

let inventoryRowCounter = 0;

export function createInventoryRow({ uuid, name, source }) {
  inventoryRowCounter += 1;
  return { key: `row-${inventoryRowCounter}`, uuid, name, source };
}
