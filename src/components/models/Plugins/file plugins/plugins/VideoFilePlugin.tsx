/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../BaseFilePlugin";
import * as path from "path";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@material-ui/core";

const { Player } = require("video-react");

export const videoExt = [".mov", ".mp4", ".avi", ".m4v", ".MOV", ".MP4"];
export class VideoFilePlugin extends BaseFilePlugin {
  canCreateFile(): boolean {
    return false;
  }
  getPluginName(): string {
    return "video";
  }
  shouldOpenNewPage(file: NasFile): boolean {
    return false;
  }
  shouldShow(file: NasFile): boolean {
    return videoExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return (
      <Dialog key={file.id} open={true} onClose={() => onClose()} fullWidth>
        <DialogTitle>{path.basename(file.filename)}</DialogTitle>
        <Player poster={file.cover}>
          <source src={file.file} />
        </Player>
        <DialogActions>
          <Button onClick={() => onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
