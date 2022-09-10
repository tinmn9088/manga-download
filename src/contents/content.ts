import type { PlasmoContentScript } from "plasmo"
import { SupportedUrl } from "../supported-url";
import type { Volume } from "../models/volume";
import type { DOMVolumeParser } from "../dom/parsers/dom-volume-parser";

export const config: PlasmoContentScript = {
  matches: ["https://mangabook.org/*", "https://w13.mangafreak.net/*"]
};

window.addEventListener("load", () => {
  console.log("Manga download content script loaded.", location.href);
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      let currentUrl: string = location.href;
      let domVolumeParser: DOMVolumeParser = SupportedUrl.get(currentUrl)?.domVolumeParser();

      if (!domVolumeParser) {
        throw new Error(`No processor found (${currentUrl})`);
      }

      let response: {volumes: Volume[], url: string} = {volumes: domVolumeParser.parse(), url: currentUrl};
      console.log("Response", response);
      sendResponse(response);
    }
  ); 
});