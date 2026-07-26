import { GeneratorApp } from "./generator-app.js";

/** Injects a "Generate NPC" button into the Actors sidebar, next to core's "Create Folder". */
export function registerDirectoryButton() {
  Hooks.on("renderActorDirectory", (app, html) => {
    if (!game.user.isGM) return;

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("npc-generator-open");
    button.innerHTML = `<i class="fa-solid fa-user-plus"></i> ${game.i18n.localize("NPC_GENERATOR.Generator.SidebarButton")}`;
    button.addEventListener("click", () => new GeneratorApp().render(true));

    const root = html instanceof HTMLElement ? html : html[0];
    const header = root.querySelector(".directory-header") ?? root.querySelector(".directory-footer");
    (header ?? root).appendChild(button);
  });
}
