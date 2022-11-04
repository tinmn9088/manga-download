import type { Volume } from "~src/models/volume";
import type { ScriptType } from "./script-type";

export interface ScriptGenerator {
  generateBeginning(): string[];
  generateDownload(volumes: Volume[]): string[];
  generateConvert(info: any): string[];
  get type(): ScriptType;
  get fileExtension(): string;
}