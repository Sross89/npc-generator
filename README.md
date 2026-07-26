# NPC Generator

A Foundry VTT module for the dnd5e system (v13+, verified on v14 / dnd5e 5.3.3) that
generates a fully-fleshed-out NPC — stat block, name, quirk, ideal, bond, flaw, race,
and inventory — from a base template in one click, instead of dragging a bare stat
block off the Monster Manual.

## What it does

- Pick a **Template** (Bandit, Guard, Commoner) and a **Race**, and the generator
  clones the template's stat block and rolls the rest: name, quirk, ideal, bond,
  flaw, ability scores, and a starting inventory (standard gear + a flavorful
  "trinket" for improv hooks).
- Every field has a reroll-dice button and is also directly editable — text fields
  are free-text, inventory slots are drag-and-drop.
- Race is a real Species item from whatever compendium you link in settings (see
  below); its size/speed/traits/features apply automatically, with no popup wizard.
- Click **Create Actor** and the finished NPC lands in a "Generated NPCs" folder in
  your world's Actors directory.

## Settings

Open **Game Settings → Configure Settings → NPC Generator** (GM only) to choose
which installed compendiums supply:

- **Spells**
- **Standard Items** (mundane/mechanical gear)
- **Species**

You can check multiple compendiums per category — they're pooled together with no
deduplication, so if two linked compendiums both have "Dagger," that's on you to
sort out. The module's own trinket/flavor content is separate and always available.

## Project layout

```
scripts/
  domain/   — pure generation logic, no Foundry API calls, testable with plain Node
  foundry/  — thin wrappers around Foundry's compendium/actor/roll-table APIs
  apps/     — the "Generate NPC" window, the settings menu, the sidebar button
packs/
  _source/  — human-editable JSON, the real authored content (edit this)
  <name>/   — compiled LevelDB packs that Foundry actually loads (generated, don't edit by hand)
```

## Editing compendium content

Everything the module ships (templates, roll tables, trinket items) lives as plain
JSON under `packs/_source/`. To change it:

1. Edit the relevant JSON file(s) under `packs/_source/<pack-name>/`.
2. Run:
   ```
   npm run build:packs
   ```
3. Reload the world in Foundry (or just reopen the compendium) to see the change.

`build:packs` shells out to `@foundryvtt/foundryvtt-cli` via `npx`, so no global
install is required — just Node.

## Manual verification checklist

There's no automated test runner for a Foundry module's UI, so verify by hand in a
test world with this module (and the dnd5e system) enabled:

1. **Settings**: open the settings menu, check a couple of compendiums under Species
   (e.g. dnd5e's own `origins24`) and Standard Items (e.g. `items`), save, reopen to
   confirm the checkboxes persisted.
2. **Sidebar button**: in the Actors directory, confirm a "Generate NPC" button
   appears next to "Create Folder" and opens the generator window.
3. **Generate**: pick Commoner + Dwarf. Confirm the name comes from the Dwarf name
   list (not the generic fallback), reroll a couple of individual fields and confirm
   only that field changes, and confirm no chat messages appear from any of the
   rerolls (they should be silent).
4. **Inventory**: reroll an inventory row, remove one, add one, and try dragging an
   Item from a compendium onto the inventory list to add it manually.
5. **Create Actor**: click Create Actor. Confirm: a "Generated NPCs" folder now
   exists in the Actors directory; the new actor's name has no template/race suffix;
   its Species item, size, speed, and granted traits (e.g. Dwarven Resilience) show
   up on the sheet with **no** advancement popup; the Biography/Ideal/Bond/Flaw
   fields on the NPC sheet are filled in; inventory items on the sheet match what
   was in the preview.
6. Repeat once each for Bandit and Guard, and once selecting Human, to exercise the
   rest of the shipped content.
