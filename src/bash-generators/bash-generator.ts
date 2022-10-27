import type { Volume } from "~src/models/volume";

export interface BashGenerator {
  generateBeginning(): string[];
  generateWget(volumes: Volume[]): string[];
  generateConvert(info: any): string[];
}