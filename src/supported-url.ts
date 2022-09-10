import { MangabookOrgBashGenerator } from "./bash-generators/mangabookorg-bash-generator";
import { W13MangafreakNetBashGenerator } from "./bash-generators/w13mangafreaknet-bash-generator";
import type { BashGenerator } from "./bash-generators/bash-generator";
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
                      public readonly bashGenerator: () => BashGenerator) {
  }

  static set(urlRegExp: RegExp, domVolumeParser: () => DOMVolumeParser, bashGenerator: () => BashGenerator) {
    let newUrl: SupportedUrl = new SupportedUrl(urlRegExp, domVolumeParser, bashGenerator);
    SupportedUrl.values.set(urlRegExp, newUrl);
  }

  static get(url: string): SupportedUrl {
    for (const key of SupportedUrl.values.keys()) {
      if (key.test(url)) return SupportedUrl.values.get(key);
    }
  }
}