/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../../BaseFilePlugin";
import * as path from "path";
import TableChartIcon from "@material-ui/icons/TableChart";
import CsvFileViewer from "./CsvFileViewer";
import { FileContentManager } from "../../../../FileContentManager";

const csvExt = [".csv"];

export class CsvFilePlugin extends BaseFilePlugin {
  canCreateFile(): boolean {
    return true;
  }
  getPluginName(): string {
    return "csv-editor";
  }

  shouldGetFileContent(): boolean {
    return true;
  }

  getIcon(size?: number): JSX.Element {
    let height = size ?? 40;
    let width = size ?? 40;
    return (
      <TableChartIcon
        style={{ height: height, width: width }}
        color="primary"
      />
    );
  }

  shouldOpenNewPage(file: NasFile): boolean {
    return true;
  }
  shouldShow(file: NasFile): boolean {
    return csvExt.includes(path.extname(file.filename));
  }

  async createFile(fileName: string, folder?: string | number): Promise<void> {
    let name = path.basename(fileName);
    let file = await FileContentManager.createFileWithName(
      `${name}.csv`,
      folder,
      `Name\nHello`
    );
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return (
      <CsvFileViewer
        file={file}
        onClose={this.onPageClose}
        leadingIcon={this.getIcon()}
      />
    );
  }
}
