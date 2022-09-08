import type { PlasmoContentScript } from "plasmo"
import { MangabookProcessor } from "~src/mangabook-processor";
import type { Volume } from "~src/models/volume";
import type { Processor } from "~src/processor";
import { MangafreakProcessor } from "./mangafreak-processor";

export const config: PlasmoContentScript = {
  matches: ["https://mangabook.org/*", "https://w13.mangafreak.net/*"]
};

let processor: Processor = new MangafreakProcessor(15);

window.addEventListener("load", () => {
  console.log("Manga download content script loaded.");

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      let volumes: Volume[] = processor.process();
      console.log("Volumes", volumes);
      sendResponse(volumes);
    }
  ); 
});