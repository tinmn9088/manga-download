import { BashGenerator } from "./bash-generator";

export class W13MangafreakNetBashGenerator extends BashGenerator {

  generateConvert(info: any): string[] {
    const author: string = info.author || "";
    const title: string = info.title || "";
    let result: string[] = [];

    result.push(`# make copy`);
    result.push('list=`ls`; mkdir next; cp -rv $list next/; cd next;\n');

    result.push(`# unzip`);
    result.push('for vol in `ls`; do cd $vol; pwd; for ch in `ls`; do unzip $ch -d "${ch%.*}"; rm $ch; done; cd ..; done;\n');

    result.push(`# [mangafreak] remove image file name prefix with manga name`);
    result.push('for vol in `ls`; do cd $vol; pwd; for ch in `ls`; do cd $ch; for img in `ls`; do mv -v $img "${img##*_}"; done; cd ..; done; cd ..; done;\n');

    result.push(`# [mangafreak] add leading zeroes`);
    result.push("for vol in `ls`; do cd $vol; pwd; for ch in `ls`; do cd $ch; for img in `ls`; do mv -v $img $(printf '%03d.%s' ${img%.*} ${img##*.}); done; cd ..; done; cd ..; done;\n");
    
    result.push(`# add image file name prefix with chapter number`);
    result.push('for vol in `ls`; do cd $vol; pwd; for ch in `ls`; do cd $ch; for img in `ls`; do mv -v $img "${ch}__${img}"; done; cd ..; done; cd ..; done;\n');

    result.push(`# move all images from a volume to a single folder`);
    result.push('for vol in `ls`; do cd $vol; pwd; for ch in `ls`; do cd $ch; for img in `ls`; do mv -v $img ..; done; cd ..; rm -r $ch; done; cd ..; done;\n');

    result.push(`# convert to pdf`);
    result.push('for vol in `ls`; do cd $vol; pwd; convert * "$(printf \'' + author + '. ' + title + '. - %02d.pdf\' ${vol})"; cd ..; done;\n');

    return result;
  }
}