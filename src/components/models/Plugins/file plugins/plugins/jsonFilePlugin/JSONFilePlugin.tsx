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

export class JSONFilePlugin extends BaseFilePlugin {
  shouldShow(file: NasFile): boolean {
    return [".json"].includes(path.extname(file.filename));
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
