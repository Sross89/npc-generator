import { execFileSync } from "node:child_process";

const MODULE_ID = "npc-generator";
const PACK_NAMES = ["npc-templates", "trinket-items", "roll-tables"];

// `shell: true` is required so `npx` resolves correctly as a .cmd shim on Windows.
// Every argument below is a hardcoded constant (module id / pack names), never user
// input, so the shell-injection risk that flag normally carries doesn't apply here.
for (const packName of PACK_NAMES) {
  console.log(`Compiling pack: ${packName}`);
  execFileSync("npx", [
    "--yes", "@foundryvtt/foundryvtt-cli",
    "package", "pack",
    "-n", packName,
    "--type", "Module",
    "--id", MODULE_ID,
    "--in", `packs/_source/${packName}`,
    "--out", "packs"
  ], { stdio: "inherit", shell: true });
}

console.log("All packs compiled.");
