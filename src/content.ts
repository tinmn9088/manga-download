import type { PlasmoContentScript } from "plasmo"
import type { Volume } from "~src/models/volume";
import type { Processor } from "~src/processor";
import { ProcessorProvider } from "./processor-provider";

export const config: PlasmoContentScript = {
  matches: ["https://mangabook.org/*", "https://w13.mangafreak.net/*"]
};

window.addEventListener("load", () => {
  console.log("Manga download content script loaded.", location.href);
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      let processor: Processor = ProcessorProvider.provide();
      let volumes: Volume[] = processor.process();
      console.log("Volumes", volumes);
      sendResponse(volumes);
    }
  ); 
});