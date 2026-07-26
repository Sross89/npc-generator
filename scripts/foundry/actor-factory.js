import { GENERATED_FOLDER_NAME, FLAGS, MODULE_ID } from "../constants.js";

async function ensureGeneratedFolder() {
  let folder = game.folders.find(f => f.type === "Actor" && f.name === GENERATED_FOLDER_NAME && !f.folder);
  if (!folder) folder = await Folder.create({ name: GENERATED_FOLDER_NAME, type: "Actor" });
  return folder;
}

/**
 * Applies a Species item's advancement (size, granted traits/features, scale values) to
 * an already-created actor with no interactive wizard. Uses dnd5e's own AdvancementManager
 * in "automaticApplication" mode (dnd5e.mjs AdvancementManager#render, confirmed against the
 * installed system) rather than reimplementing advancement resolution ourselves. If a linked
 * Species item contains a genuinely ambiguous choice, the manager will still show a small
 * popup for just that one step -- an accepted edge case for the MVP.
 */
async function applySpecies(actor, speciesUuid) {
  if (!speciesUuid) return;
  const speciesItem = await fromUuid(speciesUuid);
  if (!speciesItem) return;

  const itemData = speciesItem.toObject();
  const manager = dnd5e.applications.advancement.AdvancementManager.forNewItem(actor, itemData, {
    automaticApplication: true
  });
  if (manager.steps.length) await manager.render(true);
}

function buildActorData(state, templateActor, folder) {
  const actorData = templateActor.toObject();
  delete actorData._id;
  actorData.name = state.name || templateActor.name;
  actorData.folder = folder.id;

  actorData.system = foundry.utils.mergeObject(actorData.system, {
    abilities: {
      str: { value: state.abilities.str },
      dex: { value: state.abilities.dex },
      con: { value: state.abilities.con },
      int: { value: state.abilities.int },
      wis: { value: state.abilities.wis },
      cha: { value: state.abilities.cha }
    },
    details: {
      ideal: state.ideal,
      bond: state.bond,
      flaw: state.flaw,
      biography: {
        value: state.quirk ? `<p><strong>Quirk:</strong> ${state.quirk}</p>` : (actorData.system.details?.biography?.value ?? "")
      }
    }
  }, { inplace: false });

  actorData.flags = foundry.utils.mergeObject(actorData.flags ?? {}, {
    [MODULE_ID]: {
      [FLAGS.TEMPLATE_NAME]: state.templateName,
      [FLAGS.SPECIES_NAME]: state.speciesName
    }
  }, { inplace: false });

  return actorData;
}

async function resolveInventoryItemData(state) {
  const itemsData = [];
  for (const row of state.inventory) {
    const doc = await fromUuid(row.uuid);
    if (doc) itemsData.push(doc.toObject());
  }
  return itemsData;
}

/** Creates the finished Actor in the world, applying template, rolled fields, inventory, and species. */
export async function createActorFromState(state) {
  const folder = await ensureGeneratedFolder();
  const templateActor = await fromUuid(state.templateUuid);
  if (!templateActor) throw new Error(`NPC Generator: template actor not found for uuid ${state.templateUuid}`);

  const actorData = buildActorData(state, templateActor, folder);
  actorData.items = [...(actorData.items ?? []), ...(await resolveInventoryItemData(state))];

  const actor = await Actor.create(actorData);
  await applySpecies(actor, state.speciesUuid);
  return actor;
}
