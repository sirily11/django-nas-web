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

import CodeViewr from "./CodeViewer";
import { DialogTitle } from "@material-ui/core";

const codeMapping: { [key: string]: string } = {
  ".py": "python",
  ".java": "java",
  ".jsx": "javascript",
  ".tsx": "typescript",
  ".lua": "lua",
  ".html": "html",
  ".js": "javascript",
  ".ts": "typescript",
  ".dart": "dart",
  ".c": "c",
  ".h": "c",
  ".yml": "yaml",
  ".swift": "swift",
};

const codeExt = [
  ".py",
  ".java",
  ".jsx",
  ".tsx",
  ".lua",
  ".html",
  ".js",
  ".ts",
  ".dart",
  ".c",
  ".h",
  ".yml",
  ".swift",
];

export class CodeFilePlugin extends BaseFilePlugin {
  getPluginName(): string {
    return "coder";
  }
  shouldOpenNewPage(file: NasFile): boolean {
    return true;
  }
  shouldShow(file: NasFile): boolean {
    return codeExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return <CodeViewr file={arg.file} codeMapping={codeMapping} />;
  }
}
