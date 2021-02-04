/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../../BaseFilePlugin";
import * as path from "path";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
} from "@material-ui/core";

import JSONViewer from "./JSONViewer";
import { FileContentManager } from "../../../../FileContentManager";

export class JSONFilePlugin extends BaseFilePlugin {
  canCreateFile(): boolean {
    return true;
  }
  getPluginName(): string {
    return "json_file_viewer";
  }
  shouldOpenNewPage(file: NasFile): boolean {
    return false;
  }
  shouldShow(file: NasFile): boolean {
    return [".json"].includes(path.extname(file.filename));
  }

  async createFile(fileName: string, folder?: string | number): Promise<void> {
    let name = path.basename(fileName);
    let file = await FileContentManager.createFileWithName(
      `${name}.json`,
      folder,
      `{"hello world": "hello world"}`
    );
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return (
      <Dialog open={true} onClose={() => onClose()} fullWidth>
        <DialogTitle> {path.basename(file.filename)}</DialogTitle>
        <DialogContent>
          <JSONViewer src={file.file} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
