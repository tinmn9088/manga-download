import { MangabookProcessor } from "./mangabook-processor";
import { MangafreakProcessor } from "./mangafreak-processor";
import type { Processor } from "./processor";

export class ProcessorProvider {

  static provide(): Processor {
    let href: string = location.href;
    switch (true) {
      case /^https:\/\/mangabook\.org.*/.test(href):
        return new MangabookProcessor();
      case /^https:\/\/w13\.mangafreak\.net.*/.test(href):
        return new MangafreakProcessor(15);
      default:
        throw new Error(`No providers for: ${href}`);
    }
  }
}