export interface ShellScriptGenerator {
  generate(title: string, author: string, result: string[]): string[];
}