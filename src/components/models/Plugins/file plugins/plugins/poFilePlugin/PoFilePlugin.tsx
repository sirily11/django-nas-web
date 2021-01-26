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
} from "@material-ui/core";

import JSONViewer from "./PofileViewer";
import { DialogTitle } from "@material-ui/core";
import PoFileViewer from "./PofileViewer";

const poExt = [".po"];

export class PoFilePlugin extends BaseFilePlugin {
  getPluginName(): string {
    return "po-filer";
  }
  shouldOpenNewPage(file: NasFile): boolean {
    return false;
  }
  shouldShow(file: NasFile): boolean {
    return poExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return (
      <Dialog open={true} onClose={() => onClose()} fullScreen>
        <DialogTitle>{path.basename(file.filename)}</DialogTitle>
        <DialogContent>
          <PoFileViewer
            src={file.file}
            filename={file.filename}
            fileID={file.id}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
