import { BaseFileActionPlugin } from '../BasePlugin';
import { File as NasFile } from "../../../interfaces/Folder";
import Axios from 'axios';
import { convertCaptionURL } from '../../../urls';
import FileSaver from 'file-saver';


export class SubtitleConverterPlugin extends BaseFileActionPlugin {
    constructor() {
        super()
        this.menuString = "Convert to vtt"
    }

    shouldShow(nasFile: NasFile): boolean {
        return nasFile.filename.includes("srt")
    }


    async onClick(nasFile: NasFile) {
        let result = await Axios.post(
            `${convertCaptionURL}${nasFile.id}`
        );
        let filename = nasFile.filename.replace(".srt", ".vtt");
        let content = result.data.content;
        let blob = new Blob([content], {
            type: "text/plain;charset=utf-8",
        });
        FileSaver.saveAs(blob, filename);
    }

}