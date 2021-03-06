/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../../BaseFilePlugin";
import * as path from "path";
import NotesIcon from "@material-ui/icons/Notes";
import JupyterViewer from "./JupyterViewer";

const csvExt = [".ipynb"];

export class JupyterPlugin extends BaseFilePlugin {
  canCreateFile(): boolean {
    return false;
  }
  getPluginName(): string {
    return "jupyter-notebook";
  }

  shouldGetFileContent(): boolean {
    return true;
  }

  getIcon(size?: number): JSX.Element {
    let height = size ?? 40;
    let width = size ?? 40;
    return (
      <NotesIcon style={{ height: height, width: width }} color="primary" />
    );
  }

  shouldOpenNewPage(file: NasFile): boolean {
    return true;
  }
  shouldShow(file: NasFile): boolean {
    return csvExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return (
      <JupyterViewer
        file={file}
        onClose={this.onPageClose}
        leadingIcon={this.getIcon()}
      />
    );
  }
}
