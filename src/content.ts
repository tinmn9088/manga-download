import type { PlasmoContentScript } from "plasmo"
import { MangabookProcessor } from "~src/mangabook-processor";
import type { Volume } from "~src/models/volume";
import type { Processor } from "~src/processor";

export const config: PlasmoContentScript = {};

let processor: Processor = new MangabookProcessor();

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