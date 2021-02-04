/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../BaseFilePlugin";
import * as path from "path";
import { Dialog, CardMedia } from "@material-ui/core";
import Musicplayer from "../../../../pages/home/components/files/music/Musicplayer";
import PDFViewer from "./pdf/PDFViewer";

const pdfExt = [".pdf"];
export class PDFFIlePlugin extends BaseFilePlugin {
  canCreateFile(): boolean {
    return false;
  }
  getPluginName(): string {
    return "pdf-file";
  }
  shouldOpenNewPage(file: NasFile): boolean {
    return false;
  }
  shouldShow(file: NasFile): boolean {
    return pdfExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return (
      <Dialog key={file.id} open={true} onClose={() => onClose()} fullWidth>
        <PDFViewer file={file.file} />
      </Dialog>
    );
  }
}
