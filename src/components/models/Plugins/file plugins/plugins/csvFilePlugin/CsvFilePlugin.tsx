/** @format */
import React, { Component } from "react";
import { File as NasFile } from "../../../../interfaces/Folder";
import { BaseFilePlugin, Render } from "../../BaseFilePlugin";
import * as path from "path";
import TableChartIcon from "@material-ui/icons/TableChart";
import CsvFileViewer from "./CsvFileViewer";

const csvExt = [".csv"];

export class CsvFilePlugin extends BaseFilePlugin {
  getPluginName(): string {
    return "csv-editor";
  }

  shouldGetFileContent(): boolean {
    return true;
  }

  getIcon(size?: number): JSX.Element {
    let height = size ?? 40;
    let width = size ?? 40;
    return <TableChartIcon style={{ height: height, width: width }} />;
  }

  shouldOpenNewPage(file: NasFile): boolean {
    return true;
  }
  shouldShow(file: NasFile): boolean {
    return csvExt.includes(path.extname(file.filename));
  }

  render(arg: Render): JSX.Element {
    const { file, onClose } = arg;
    return <CsvFileViewer file={file} onClose={this.onPageClose} />;
  }
}
