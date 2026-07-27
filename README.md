# NPC Generator

A Foundry VTT module for the dnd5e system (v13+, verified on v14 / dnd5e 5.3.3) that
generates a fully-fleshed-out NPC — stat block, name, quirk, ideal, bond, flaw, race,
and inventory — from a base template in one click, instead of dragging a bare stat
block off the Monster Manual.

**Requires [Wormsworth's Content Library](https://github.com/Sross89/wormsworth-content-library)**
to be installed and enabled — this module ships no content of its own (no templates, no
roll tables, no trinket items). Foundry will refuse to activate this module until the
library is also installed.

## Installing

1. Install and enable **Wormsworth's Content Library** first.
2. Install and enable **NPC Generator**.

That's it — the settings default to the library's own Templates and Roll Tables packs,
so the generator works immediately with no configuration.

## What it does

- Pick a **Template** and a **Race**, and the generator clones the template's stat
  block and rolls the rest: name, quirk, ideal, bond, flaw, ability scores, and a
  starting inventory (standard gear + a flavorful "trinket" for improv hooks).
- Every field has a reroll-dice button and is also directly editable — text fields
  are free-text, inventory slots are drag-and-drop.
- Race is a real Species item from whatever compendium you link in settings; its
  size/speed/traits/features apply automatically, with no popup wizard.
- Click **Create Actor** and the finished NPC lands in a "Generated NPCs" folder in
  your world's Actors directory.

## Settings

Open **Game Settings → Configure Settings → NPC Generator** (GM only) to choose which
installed compendiums supply:

- **Spells** (empty by default — link your own, e.g. dnd5e's `spells24`)
- **Standard Items** (empty by default — link your own, e.g. dnd5e's `items`)
- **Species** (empty by default — link your own, e.g. dnd5e's `origins24`)
- **Templates** (defaults to Wormsworth's Content Library)
- **Roll Tables** (defaults to Wormsworth's Content Library — quirks, ideals, bonds,
  flaws, names, and the trinket-drawing table)

You can check multiple compendiums per category — they're pooled together with no
deduplication, so if two linked compendiums both have "Dagger," that's on you to sort
out.

## Project layout

```
scripts/
  domain/   — pure generation logic, no Foundry API calls, testable with plain Node
  foundry/  — thin wrappers around Foundry's compendium/actor/roll-table APIs
  apps/     — the "Generate NPC" window, the settings menu, the sidebar button
```

There's no `packs/` here anymore — see Wormsworth's Content Library for the shipped
content and its own edit/rebuild workflow.

## Manual verification checklist

There's no automated test runner for a Foundry module's UI, so verify by hand in a test
world with both this module and the content library enabled:

1. **Dependency check**: disable Wormsworth's Content Library and confirm Foundry
   refuses to activate NPC Generator. Re-enable it.
2. **Settings**: open the settings menu, confirm Templates and Roll Tables show up
   pre-checked against the library's packs; check a compendium under Species (e.g.
   dnd5e's `origins24`) and Standard Items (e.g. `items`), save, reopen to confirm
   persistence.
3. **Sidebar button**: in the Actors directory, confirm a "Generate NPC" button
   appears next to "Create Folder" and opens the generator window.
4. **Generate**: pick Commoner + Dwarf. Confirm the name comes from the Dwarf name
   list (not the generic fallback), reroll a couple of individual fields and confirm
   only that field changes, and confirm no chat messages appear from any of the
   rerolls (they should be silent).
5. **Inventory**: reroll an inventory row, remove one, add one, and try dragging an
   Item from a compendium onto the inventory list to add it manually.
6. **Create Actor**: click Create Actor. Confirm: a "Generated NPCs" folder now
   exists in the Actors directory; the new actor's name has no template/race suffix;
   its Species item, size, speed, and granted traits (e.g. Dwarven Resilience) show
   up on the sheet with **no** advancement popup; the Biography/Ideal/Bond/Flaw
   fields on the NPC sheet are filled in; inventory items on the sheet match what
   was in the preview.
7. Repeat once each for a couple of the *new* templates only available via the
   library now (e.g. Priest, Mage, Knight) to exercise the expanded template set.
