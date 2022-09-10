import type { Volume } from "../../models/volume";

export interface DOMVolumeParser {
  parse(): Volume[];
}