import { MangabookOrgBashGenerator } from "./script-generators/mangabookorg-bash-generator";
import { MangafreakNetBashGenerator } from "./script-generators/mangafreaknet-bash-generator";
import type { ScriptGenerator } from "./script-generators/script-generator";
import { MangabookOrgDOMVolumeParser } from "./dom/parsers/mangabookorg-dom-volume-parser";
import { MangafreakNetDOMVolumeParser } from "./dom/parsers/mangafreaknet-dom-volume-parser";
import type { DOMVolumeParser } from "./dom/parsers/dom-volume-parser";

export class SupportedUrl {

  private static values: Map<RegExp, SupportedUrl> = new Map<RegExp, SupportedUrl>();

  static {
    this.set(/^https:\/\/mangabook\.org.*/,
                () => new MangabookOrgDOMVolumeParser(),
                [() => new MangabookOrgBashGenerator()]);
    this.set(/^https:\/\/.*\.mangafreak\.net.*/,
                () => new MangafreakNetDOMVolumeParser(15),
                [() => new MangafreakNetBashGenerator()]);  
  }

  private constructor(public readonly urlRegExp: RegExp,
                      public readonly domVolumeParser: () => DOMVolumeParser, 
                      public readonly scriptGenerators: (() => ScriptGenerator)[]) {
  }

  static set(urlRegExp: RegExp, domVolumeParser: () => DOMVolumeParser, scriptGenerators: (() => ScriptGenerator)[]) {
    let newUrl: SupportedUrl = new SupportedUrl(urlRegExp, domVolumeParser, scriptGenerators);
    SupportedUrl.values.set(urlRegExp, newUrl);
  }

  static get(url: string): SupportedUrl {
    for (const key of SupportedUrl.values.keys()) {
      if (key.test(url)) return SupportedUrl.values.get(key);
    }
  }
}