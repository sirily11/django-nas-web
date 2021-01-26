/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../BaseFilePlugin";
import * as path from "path";
import { Dialog, CardMedia, DialogActions, Button } from "@material-ui/core";
import Musicplayer from "../../../../pages/home/components/files/music/Musicplayer";

export const imageExt = [
  ".jpg",
  ".png",
  ".bmp",
  ".JPG",
  ".gif",
  ".jpeg",
  ".JPEG",
];
export class ImageFilePlugin extends BaseFilePlugin {
  getPluginName(): string {
    return "image";
  }
  shouldOpenNewPage(file: NasFile): boolean {
    return false;
  }
  shouldShow(file: NasFile): boolean {
    return imageExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return (
      <Dialog open={true} onClose={() => onClose()} fullWidth>
        <CardMedia image={file.file} style={{ width: "100%", height: 700 }} />
        <DialogActions>
          <Button onClick={() => onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
