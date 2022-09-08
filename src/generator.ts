import type { Volume } from "./models/volume";

export class Generator {

  static generate(volumes: Volume[]): string[] {
    let volumeNumberLength: number = Math.max(...volumes.map(volume => volume.number.length));
    let chapterNumberLength: number = Math.max(...volumes.map(volume => volume.urls.length.toString().length)); 
    let result: string[] = [];

    volumes.forEach(volume => {
      result.push(`# ${volume.number}`);
      result.push(`mkdir ${volume.number};`);
      result.push(`cd ${volume.number};`);

      let volumeNumber: string = volume.number.padStart(volumeNumberLength, '0');

      volume.urls.forEach((url, index) => {
        let chapterNumber = (index + 1).toString().padStart(chapterNumberLength, '0');
        result.push(`wget ${url} -O ${volumeNumber}_${chapterNumber}.zip;`);
      });

      result.push(`cd ..;\n`);
    });

    return result;
  }
}