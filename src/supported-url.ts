import { MangabookOrgBashBuilder } from "./bash-builders/mangabookorg-bash-builder";
import { W13MangafreakNetBashBuilder } from "./bash-builders/w13mangafreaknet-bash-builder";
import type { BashBuilder } from "./bash-builders/bash-builder";
import { MangabookOrgDOMVolumeParser } from "./dom/parsers/mangabookorg-dom-volume-parser";
import { W13MangafreakNetDOMVolumeParser } from "./dom/parsers/w13mangafreaknet-dom-volume-parser";
import type { DOMVolumeParser } from "./dom/parsers/dom-volume-parser";

export class SupportedUrl {

  private static values: Map<RegExp, SupportedUrl> = new Map<RegExp, SupportedUrl>();

  static {
    this.set(/^https:\/\/mangabook\.org.*/,
                () => new MangabookOrgDOMVolumeParser(),
                () => new MangabookOrgBashBuilder());
    this.set(/^https:\/\/w13\.mangafreak\.net.*/,
                () => new W13MangafreakNetDOMVolumeParser(15),
                () => new W13MangafreakNetBashBuilder());  
  }

  private constructor(public readonly urlRegExp: RegExp,
                      public readonly domVolumeParser: () => DOMVolumeParser, 
                      public readonly bashBuilder: () => BashBuilder) {
  }

  static set(urlRegExp: RegExp, domVolumeParser: () => DOMVolumeParser, bashBuilder: () => BashBuilder) {
    let newUrl: SupportedUrl = new SupportedUrl(urlRegExp, domVolumeParser, bashBuilder);
    SupportedUrl.values.set(urlRegExp, newUrl);
  }

  static get(url: string): SupportedUrl {
    for (const key of SupportedUrl.values.keys()) {
      if (key.test(url)) return SupportedUrl.values.get(key);
    }
  }
}