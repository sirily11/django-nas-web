/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../BaseFilePlugin";
import * as path from "path";
import { Dialog } from "@material-ui/core";
import Musicplayer from "../../../../pages/home/components/files/music/Musicplayer";

const audioExt = [".mp3", ".m4a"];
export class MusicFilePlugin extends BaseFilePlugin {
  getPluginName(): string {
    return "music";
  }
  shouldOpenNewPage(file: NasFile): boolean {
    return false;
  }
  shouldShow(file: NasFile): boolean {
    return audioExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return <Musicplayer musicSrc={file.file} onClose={onClose} />;
  }
}
