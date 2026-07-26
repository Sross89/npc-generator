import { TABLE_NAMES } from "../constants.js";

/**
 * Picks which name RollTable to draw from: a species-specific table if one exists
 * among the tables actually authored in the module's compendium, otherwise the
 * generic fallback. Kept pure so the matching rule is testable without Foundry.
 */
export function resolveNameTable(speciesName, availableTableNames) {
  if (speciesName) {
    const specific = TABLE_NAMES.namesForSpecies(speciesName);
    if (availableTableNames.includes(specific)) return specific;
  }
  return TABLE_NAMES.NAMES_GENERIC;
}
