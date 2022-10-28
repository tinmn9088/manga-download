import { MangabookOrgBashGenerator } from "./script-generators/mangabookorg-bash-generator";
import { W13MangafreakNetBashGenerator } from "./script-generators/w13mangafreaknet-bash-generator";
import type { ScriptGenerator } from "./script-generators/script-generator";
import { MangabookOrgDOMVolumeParser } from "./dom/parsers/mangabookorg-dom-volume-parser";
import { W13MangafreakNetDOMVolumeParser } from "./dom/parsers/w13mangafreaknet-dom-volume-parser";
import type { DOMVolumeParser } from "./dom/parsers/dom-volume-parser";

export class SupportedUrl {

  private static values: Map<RegExp, SupportedUrl> = new Map<RegExp, SupportedUrl>();

  static {
    this.set(/^https:\/\/mangabook\.org.*/,
                () => new MangabookOrgDOMVolumeParser(),
                () => new MangabookOrgBashGenerator());
    this.set(/^https:\/\/w13\.mangafreak\.net.*/,
                () => new W13MangafreakNetDOMVolumeParser(15),
                () => new W13MangafreakNetBashGenerator());  
  }

  private constructor(public readonly urlRegExp: RegExp,
                      public readonly domVolumeParser: () => DOMVolumeParser, 
                      public readonly scriptGenerator: () => ScriptGenerator) {
  }

  static set(urlRegExp: RegExp, domVolumeParser: () => DOMVolumeParser, scriptGenerator: () => ScriptGenerator) {
    let newUrl: SupportedUrl = new SupportedUrl(urlRegExp, domVolumeParser, scriptGenerator);
    SupportedUrl.values.set(urlRegExp, newUrl);
  }

  static get(url: string): SupportedUrl {
    for (const key of SupportedUrl.values.keys()) {
      if (key.test(url)) return SupportedUrl.values.get(key);
    }
  }
}