import type { Volume } from "~src/models/volume";
import type { ScriptGenerator } from "./script-generator";
import { ScriptType } from "./script-type";
import scriptTypeFileExtension from "./script-type-file-extension";

export abstract class BashGeneratorWithWget implements ScriptGenerator {

  generateDownload(volumes: Volume[]): string[] {
    let volumeNumberLength: number = Math.max(...volumes.map(volume => volume.number.length));
    let chapterNumberLength: number = Math.max(...volumes.map(volume => volume.urls.length.toString().length)); 
    let result: string[] = [];

    volumes.forEach(volume => {
      result.push(`# ${volume.number}`);
      result.push(`mkdir ${volume.number};`);
      result.push(`cd ${volume.number};`);

      let volumeNumber: string = volume.number.padStart(volumeNumberLength, "0");

      volume.urls.forEach((url, index) => {
        let chapterNumber = (index + 1).toString().padStart(chapterNumberLength, "0");
        result.push(`wget ${url} -O ${volumeNumber}_${chapterNumber}.zip;`);
      });

      result.push(`cd ..;\n`);
    });

    return result;
  }

  get type(): ScriptType {
    return ScriptType.Bash;
  }

  get fileExtension(): string {
    return scriptTypeFileExtension.get(this.type);
  }

  abstract generateBeginning(): string[];

  abstract generateConvert(info: any): string[];
}