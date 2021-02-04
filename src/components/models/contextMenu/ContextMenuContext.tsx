/** @format */

import React, { Component } from "react";
import { Nas } from "../interfaces/nas";
import { RouteComponentProps } from "react-router";
import {
  Folder,
  Document as NasDocument,
  File as NasFile,
} from "../interfaces/Folder";
import { UploadInfo } from "../../pages/home/components/files/dialog/UploadDialog";
import Axios from "axios";
import { updateDescriptionURL, convertCaptionURL } from "../urls";
import { Menu, MenuItem } from "@material-ui/core";
import FileSaver from "file-saver";
import { BaseFileActionPlugin } from "../Plugins/file action plugins/BasePlugin";
import { SubtitleConverterPlugin } from "../Plugins/file action plugins/plugins/SubtitlePlugin";
import { CodeFilePlugin } from "../Plugins/file plugins/plugins/codeFilePlugin/CodeFilePlugin";
import { CodeActionPlugin } from "../Plugins/file action plugins/plugins/CodePlugin";
export enum ContextMenuType {
  file,
  folder,
}

export interface ContextMenuData {
  mouseX: number;
  mouseY: number;
  menuType: ContextMenuType;
  file?: NasFile;
  folder?: Folder;
  document?: NasDocument;
}

interface ContextMenuContext {
  contextMenuData?: ContextMenuData;
  openContextMenu(contextMenuData: ContextMenuData): void;
  closeContextMenu(): void;
}

interface ContextMenuProps {}

export class ContextMenuProvider extends Component<
  ContextMenuProps,
  ContextMenuContext
> {
  plugins: BaseFileActionPlugin[];

  constructor(props: ContextMenuProps) {
    super(props);
    this.plugins = [new SubtitleConverterPlugin(), new CodeActionPlugin()];
    this.state = {
      openContextMenu: this.openContextMenu,
      closeContextMenu: this.closeContextMenu,
    };
  }

  openContextMenu = (contextMenuData: ContextMenuData): void => {
    this.setState({ contextMenuData });
  };
  closeContextMenu = (): void => {
    this.setState({ contextMenuData: undefined });
  };
  render() {
    return (
      <ContextMenuContext.Provider value={this.state}>
        {this.props.children}
      </ContextMenuContext.Provider>
    );
  }
}

//@ts-ignore
const context: ContextMenuContext = {};

export const ContextMenuContext = React.createContext(context);
