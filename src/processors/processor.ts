import type { Volume } from "../models/volume";

export interface Processor {
  process(): Volume[];
}