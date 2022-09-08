import { MangabookShellScriptGenerator } from "./mangabook-shell-script-generator";
import { MangafreakShellScriptGenerator } from "./mangafreak-shell-script-generator";
import type { ShellScriptGenerator } from "./shell-script-generator";

export class ShellScriptGeneratorProvider {

  static provide(href: string): ShellScriptGenerator {
    switch (true) {
      case /^https:\/\/mangabook\.org.*/.test(href):
        return new MangabookShellScriptGenerator();
      case /^https:\/\/w13\.mangafreak\.net.*/.test(href):
        return new MangafreakShellScriptGenerator();
      default:
        throw new Error(`No shell script generators for: ${href}`);
    }
  }
}