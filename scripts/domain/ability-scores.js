const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"];

export function rollAbilityScore(rollDie) {
  const dice = [rollDie(), rollDie(), rollDie(), rollDie()];
  dice.sort((a, b) => b - a);
  return dice[0] + dice[1] + dice[2];
}

export function rollAbilityScores(rollDie) {
  const scores = {};
  for (const key of ABILITY_KEYS) scores[key] = rollAbilityScore(rollDie);
  return scores;
}
