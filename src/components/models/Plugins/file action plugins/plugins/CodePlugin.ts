import { BaseFileActionPlugin } from '../BasePlugin';
import { File as NasFile } from "../../../interfaces/Folder";
import Axios from 'axios';
import { convertCaptionURL } from '../../../urls';
import FileSaver from 'file-saver';
import { CodeFilePlugin } from "../../file plugins/plugins/codeFilePlugin/CodeFilePlugin";


export class CodeActionPlugin extends BaseFileActionPlugin {
    constructor() {
        super();
        this.menuString = "Open With Code Editor";
    }

    shouldShow(nasFile: NasFile): boolean {
        return true;
    }


    async onClick(nasFile: NasFile) {
        let plugin = new CodeFilePlugin();
        window.open(`#/plugin/${plugin.getPluginName()}/${nasFile.id}`);
        let promise = new Promise<any>((resolve) =>
            window.addEventListener("closed-plugin", resolve)
        );

        return promise;
    }

}