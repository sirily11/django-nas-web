/** @format */

import React, { Component } from "react";
import { File as NasFile } from "../../interfaces/Folder";
import DescriptionIcon from "@material-ui/icons/Description";
import { FileContentManager } from "../../FileContentManager";

export interface Render {
  file: NasFile;
  onClose(promise?: Promise<any>): void;
}

export interface DefaultPluginProps {
  file: NasFile;
  onClose(): void;
  leadingIcon: JSX.Element;
}

export abstract class BaseFilePlugin {
  shouldGetFileContent(): boolean {
    return false;
  }

  /**
   * Get plugin's name. Used for plugin path mapping
   */
  abstract getPluginName(): string;

  abstract canCreateFile(): boolean;

  getIcon(size?: number): JSX.Element {
    let height = size ?? 40;
    let width = size ?? 40;
    return (
      <DescriptionIcon
        style={{ height: height, width: width }}
        color="primary"
      />
    );
  }

  /**
   * Whether the plugin should open
   */
  abstract shouldShow(file: NasFile): boolean;

  abstract shouldOpenNewPage(file: NasFile): boolean;

  onPageClose = () => {
    const customEvent = new CustomEvent("closed-plugin", {
      detail: {},
    });
    window.opener.dispatchEvent(customEvent);
  };

  openFile(arg: Render): JSX.Element | undefined {
    if (this.shouldShow(arg.file)) {
      if (this.shouldOpenNewPage(arg.file)) {
        window.open(`#/plugin/${this.getPluginName()}/${arg.file.id}`);
        let promise = new Promise((resolve) =>
          window.addEventListener("closed-plugin", resolve)
        );
        arg.onClose(promise);
        return undefined;
      } else {
        return this.render(arg);
      }
    }
    return undefined;
  }

  /**
   * If can create file, then will create file and redirect
   * @param fileName File name
   * @param folder Parent folder
   */
  async createFile(fileName: string, folder?: string | number): Promise<void> {
    let file = await FileContentManager.createFileWithName(
      fileName,
      folder,
      ""
    );
  }

  abstract render(arg: Render): JSX.Element;
}
