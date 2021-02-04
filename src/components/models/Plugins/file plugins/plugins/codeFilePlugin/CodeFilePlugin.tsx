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
  ".md": "markdown",
  ".txt": "text",
  ".rtf": "text",
  ".css": "css",
  ".scss": "css",
  ".cpp": "cpp",
  ".xml": "xml",
  ".ipynb": "json",
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
  ".md",
  ".txt",
  ".rtf",
  ".css",
  ".scss",
  ".cpp",
  ".xml",
  "Dockerfile",
  ".go",
];

export class CodeFilePlugin extends BaseFilePlugin {
  canCreateFile(): boolean {
    return true;
  }
  shouldGetFileContent(): boolean {
    return true;
  }

  getPluginName(): string {
    return "coder";
  }
  shouldOpenNewPage(file: NasFile): boolean {
    return true;
  }
  shouldShow(file: NasFile): boolean {
    if (file.size > 100 * 1024 * 1024 * 1024) {
      window.alert("Too large to open");
      return false;
    }
    return codeExt.includes(path.extname(file.filename) || file.filename);
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return (
      <CodeViewr
        file={arg.file}
        codeMapping={codeMapping}
        onClose={this.onPageClose}
        leadingIcon={this.getIcon()}
      />
    );
  }
}
