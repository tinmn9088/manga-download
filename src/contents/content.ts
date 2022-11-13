import type { PlasmoContentScript } from "plasmo"
import { SupportedUrl } from "../supported-url";
import type { Volume } from "../models/volume";
import type { DOMVolumeParser } from "../dom/parsers/dom-volume-parser";

export const config: PlasmoContentScript = {
  matches: ["https://mangabook.org/*", "https://*.mangafreak.net/*"]
};

window.addEventListener("load", () => {
  console.log("Manga download content script loaded.", location.href);
  
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      let currentUrl: string = location.href;
      let domVolumeParser: DOMVolumeParser = SupportedUrl.get(currentUrl)?.domVolumeParser();
      console.log(domVolumeParser);
      

      if (!domVolumeParser) {
        throw new Error(`No DOMVolumeParser found (${currentUrl})`);
      }

      let volumes: Volume[] = domVolumeParser.parse();
      console.log("Volumes", volumes);
      sendResponse(volumes);
    }
  ); 
});