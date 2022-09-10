import type { Chapter } from "../../models/chapter";
import type { Volume } from "../../models/volume";
import type { DOMVolumeParser } from "./dom-volume-parser";

export class W13MangafreakNetDOMVolumeParser implements DOMVolumeParser {

  constructor(private _volumeSize: number) {
  }

  public get volumeSize() {
    return this._volumeSize;
  }

  parse(): Volume[] {

    // receive nodes that store download links
    let nodeList: NodeListOf<Element> = document.querySelectorAll(`div[class="manga_series_list"] a[download]`);
    let nodeArray: Element[] = Array.from(nodeList);

    // fetch volume number and url
    let volumeNumber: number = 1;
    let currentVolumeSize: number = 0;
    let chapters: Chapter[] = nodeArray.map(elem => {
      let url: string;
    
      if (currentVolumeSize >= this._volumeSize) {
        currentVolumeSize = 0;
        volumeNumber++;
      }
    
      try {
        url = elem.getAttribute("href");
      } catch (err) {
        return undefined;
      }
    
      currentVolumeSize++;
      return {volumeNumber: `${volumeNumber}`, url: url};
    });
    
    chapters = chapters.filter(chapter => chapter);

    // group chapters by volume numbers
    let volumeNumbers: string[] = [];
    chapters.forEach(chapter => {
      let volumeNumber = chapter.volumeNumber;
      if (!volumeNumbers.includes(volumeNumber)) volumeNumbers.push(volumeNumber);
    });
    let volumes: Volume[] = volumeNumbers.map(volumeNumber => { 
      return {number: volumeNumber, urls: []}; 
    });
    chapters.forEach(chapter => {
      let volume = volumes.find(volume => volume.number === chapter.volumeNumber);
      volume.urls.push(chapter.url);
    });

    return volumes;
  }
}