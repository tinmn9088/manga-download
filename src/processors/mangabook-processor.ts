import type { Chapter } from "../models/chapter";
import type { Volume } from "../models/volume";
import type { Processor } from "./processor";

export class MangabookProcessor implements Processor {

  process(): Volume[] {

    // receive nodes that store download links
    let nodeList: NodeListOf<Element> = document.querySelectorAll(`div[class*="chapters-elem-download"]`);
    let nodeArray: Element[] = Array.from(nodeList).reverse();

    // fetch volume number and url
    let chapters: Chapter[] = nodeArray.map(elem => {
      let volumeNumber: string, url: string;

      try {
        volumeNumber = elem.parentElement.className.match(/volume-(.*)/)[1];
        url = elem.querySelector("a").getAttribute("href");
      } catch (err) {
        return undefined;
      }

      return {volumeNumber: volumeNumber, url: url};
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