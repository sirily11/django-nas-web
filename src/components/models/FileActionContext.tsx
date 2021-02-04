/** @format */

import React, { Component } from "react";
import { Nas } from "./interfaces/nas";
import { RouteComponentProps } from "react-router";
import {
  Folder,
  Document as NasDocument,
  File as NasFile,
} from "./interfaces/Folder";
import { UploadInfo } from "../pages/home/components/files/dialog/UploadDialog";
import Axios from "axios";
import { updateDescriptionURL, convertCaptionURL } from "./urls";
import { Menu, MenuItem } from "@material-ui/core";
import FileSaver from "file-saver";
import { BaseFileActionPlugin } from "./Plugins/file action plugins/BasePlugin";
import { SubtitleConverterPlugin } from "./Plugins/file action plugins/plugins/SubtitlePlugin";
import { CodeFilePlugin } from "./Plugins/file plugins/plugins/codeFilePlugin/CodeFilePlugin";
import { CodeActionPlugin } from "./Plugins/file action plugins/plugins/CodePlugin";

interface FileActionContext {
  nas?: Nas;
  currentFile?: NasFile;
  showRenameDialog: boolean;
  showMoveToDialog: boolean;
  anchor?: HTMLElement;
  openMenu(anchor: HTMLElement, file: NasFile, nas: Nas): void;
  closeMenu(): void;
  setCurrentFile(file: NasFile): void;
  closeRenameDialog(): void;
  closeMoveToDialog(): void;
  renderMenu(): any;
}

interface FileActionProps {}

export class FileActionProvider extends Component<
  FileActionProps,
  FileActionContext
> {
  plugins: BaseFileActionPlugin[];

  constructor(props: FileActionProps) {
    super(props);
    this.plugins = [new SubtitleConverterPlugin(), new CodeActionPlugin()];
    this.state = {
      showRenameDialog: false,
      showMoveToDialog: false,
      openMenu: this.openMenu,
      closeMoveToDialog: this.closeMoveToDialog,
      closeRenameDialog: this.closeRenameDialog,
      setCurrentFile: this.setCurrentFile,
      closeMenu: this.closeMenu,
      renderMenu: this.renderMenu,
    };
  }

  openMenu = (anchor: HTMLElement, file: NasFile, nas: Nas) => {
    this.setState({ currentFile: file, anchor: anchor, nas: nas });
  };

  closeMenu = () => {
    this.setState({ currentFile: undefined, anchor: undefined });
  };

  hideMenu = () => {
    this.setState({ anchor: undefined });
  };

  setCurrentFile = (file: NasFile) => {
    this.setState({ currentFile: file });
  };

  closeRenameDialog = () => {
    this.setState({ showRenameDialog: false, currentFile: undefined });
  };

  closeMoveToDialog = () => {
    this.setState({ showMoveToDialog: false, currentFile: undefined });
  };

  renderMenu = () => {
    const { currentFile, anchor, nas } = this.state;
    if (nas === undefined) {
      return <div></div>;
    }
    if (nas)
      return (
        <Menu
          id="simple-menu"
          anchorEl={anchor}
          keepMounted
          open={Boolean(anchor)}
          onClose={this.closeMenu}
        >
          <MenuItem
            onClick={() => {
              /// Download from link
              if (currentFile) {
                const link = document.createElement("a");
                link.setAttribute("download", currentFile.filename);
                link.href = `${currentFile.file}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
              this.closeMenu();
            }}
          >
            Download
          </MenuItem>
          <MenuItem
            onClick={async () => {
              if (currentFile) {
                this.hideMenu();
                this.setState({ showRenameDialog: true });
              }
            }}
          >
            Rename
          </MenuItem>
          <MenuItem
            onClick={async () => {
              if (currentFile) {
                await nas.deleteFile(currentFile.id);
                this.closeMenu();
                this.setState({ nas: nas });
              }
            }}
          >
            Delete
          </MenuItem>
          <MenuItem
            onClick={async () => {
              if (currentFile) {
                this.hideMenu();
                this.setState({ showMoveToDialog: true });
              }
            }}
          >
            Move To
          </MenuItem>
          {this.plugins.map(
            (plugin, index) =>
              currentFile &&
              plugin.shouldShow(currentFile) && (
                <MenuItem
                  onClick={async () => {
                    let result = await plugin.onClick(currentFile);
                    this.closeMenu();
                    if (result) {
                      await result;
                      window.location.reload();
                    }
                  }}
                >
                  {plugin.menuString}
                </MenuItem>
              )
          )}
        </Menu>
      );
  };

  render() {
    return (
      <FileActionContext.Provider value={this.state}>
        {this.props.children}
      </FileActionContext.Provider>
    );
  }
}

//@ts-ignore
const context: FileActionContext = {};

export const FileActionContext = React.createContext(context);
