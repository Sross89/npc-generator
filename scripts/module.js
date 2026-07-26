import { MODULE_ID } from "./constants.js";
import { registerSettings } from "./foundry/settings.js";
import { SettingsMenuApp } from "./apps/settings-menu-app.js";
import { registerDirectoryButton } from "./apps/directory-button.js";

Hooks.once("init", () => {
  registerSettings(SettingsMenuApp);
  registerDirectoryButton();

  foundry.applications.handlebars.loadTemplates([
    `modules/${MODULE_ID}/templates/partials/flavor-field.hbs`,
    `modules/${MODULE_ID}/templates/partials/inventory-row.hbs`
  ]);

  console.log(`${MODULE_ID} | Initialized`);
});
