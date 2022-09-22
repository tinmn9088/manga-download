import type { Volume } from "~src/models/volume";

export interface BashGenerator {
  generateWget(volumes: Volume[]): string[];
  generateConvert(info: any): string[];
}