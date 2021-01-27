/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../../BaseFilePlugin";
import * as path from "path";

import PoFileViewer from "./PofileViewer";

const poExt = [".po"];

export class PoFilePlugin extends BaseFilePlugin {
  getPluginName(): string {
    return "po-filer";
  }

  shouldGetFileContent(): boolean {
    return true;
  }

  shouldOpenNewPage(file: NasFile): boolean {
    return true;
  }
  shouldShow(file: NasFile): boolean {
    return poExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return <PoFileViewer file={file} onClose={this.onPageClose} />;
  }
}
