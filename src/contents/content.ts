import type { PlasmoContentScript } from "plasmo"
import { SupportedUrl } from "~src/supported-urls";
import type { Volume } from "../models/volume";
import type { Processor } from "../processors/processor";

export const config: PlasmoContentScript = {
  matches: ["https://mangabook.org/*", "https://w13.mangafreak.net/*"]
};

window.addEventListener("load", () => {
  console.log("Manga download content script loaded.", location.href);
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      let currentUrl: string = location.href;
      let processor: Processor = SupportedUrl.get(currentUrl)?.processor();

      if (!processor) {
        throw new Error(`No processor found (${currentUrl})`);
      }

      let response: {volumes: Volume[], url: string} = {volumes: processor.process(), url: currentUrl};
      console.log("Response", response);
      sendResponse(response);
    }
  ); 
});