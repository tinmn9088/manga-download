export interface ShellScriptGenerator {
  generate(info: any, result: string[]): string[];
}