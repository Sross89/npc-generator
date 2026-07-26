/**
 * Lists every installed compendium of a given document type, for populating the
 * settings-menu checkboxes. Excludes this module's own packs — those are the
 * module-authored content, not something the DM links back to itself.
 */
export function listCompendiums(documentType, { excludePackIds = [] } = {}) {
  return game.packs
    .filter(pack => pack.documentName === documentType && !excludePackIds.includes(pack.collection))
    .map(pack => ({ id: pack.collection, label: pack.metadata?.label ?? pack.title }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
