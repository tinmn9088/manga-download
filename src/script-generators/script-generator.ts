import type { Volume } from "~src/models/volume";

export interface ScriptGenerator {
  generateBeginning(): string[];
  generateDownload(volumes: Volume[]): string[];
  generateConvert(info: any): string[];
  getFileExtenstion(): string;
}