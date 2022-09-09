import { MangabookShellScriptGenerator } from "./generators/mangabook-shell-script-generator";
import { MangafreakShellScriptGenerator } from "./generators/mangafreak-shell-script-generator";
import type { ShellScriptGenerator } from "./generators/shell-script-generator";
import { MangabookProcessor } from "./processors/mangabook-processor";
import { MangafreakProcessor } from "./processors/mangafreak-processor";
import type { Processor } from "./processors/processor";

export class SupportedUrl {

  private static values: Map<RegExp, SupportedUrl> = new Map<RegExp, SupportedUrl>();

  static {
    this.set(/^https:\/\/mangabook\.org.*/,
                () => new MangabookProcessor(),
                () => new MangabookShellScriptGenerator());
    this.set(/^https:\/\/w13\.mangafreak\.net.*/,
                () => new MangafreakProcessor(15),
                () => new MangafreakShellScriptGenerator());  
  }

  private constructor(public readonly urlRegExp: RegExp,
                      public readonly processor: () => Processor, 
                      public readonly shellScriptGenerator: () => ShellScriptGenerator) {
  }

  static set(urlRegExp: RegExp, processor: () => Processor, shellScriptGenerator: () => ShellScriptGenerator) {
    let newUrl: SupportedUrl = new SupportedUrl(urlRegExp, processor, shellScriptGenerator);
    SupportedUrl.values.set(urlRegExp, newUrl);
  }

  static get(url: string): SupportedUrl {
    for (const key of SupportedUrl.values.keys()) {
      if (key.test(url)) return SupportedUrl.values.get(key);
    }
  }
}