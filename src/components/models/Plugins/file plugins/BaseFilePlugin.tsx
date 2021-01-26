/** @format */

import React, { Component } from "react";
import { File as NasFile } from "../../interfaces/Folder";

export interface Render {
  file: NasFile;
  onClose(): void;
}

export abstract class BaseFilePlugin {
  /**
   * Get plugin's name. Used for plugin path mapping
   */
  abstract getPluginName(): string;

  /**
   * Whether the plugin should open
   */
  abstract shouldShow(file: NasFile): boolean;

  abstract shouldOpenNewPage(file: NasFile): boolean;

  openFile(arg: Render): JSX.Element | undefined {
    if (this.shouldShow(arg.file)) {
      if (this.shouldOpenNewPage(arg.file)) {
        window.open(`#/plugin/${this.getPluginName()}/${arg.file.id}`);
        arg.onClose();
        return undefined;
      } else {
        return this.render(arg);
      }
    }
    return undefined;
  }

  abstract render(arg: Render): JSX.Element;
}
