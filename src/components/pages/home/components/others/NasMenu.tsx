/** @format */

import React, { useContext, useState } from "react";
import {
  Button,
  Icon,
  Grid,
  Breadcrumb,
  Segment,
  Card,
  MenuItem as MMenuItem,
} from "semantic-ui-react";
import { HomePageContext } from "../../../../models/HomeContext";
import UploadDialog from "../files/dialog/UploadDialog";
import NewFolderDialog from "../folders/NewFolderDialog";
import { ContextMenu, MenuItem } from "react-contextmenu";

import { Menu } from "semantic-ui-react";
import CreateDocumentDialog from "../documents/CreateDocumentDialog";
import { BaseFilePlugin } from "../../../../models/Plugins/file plugins/BaseFilePlugin";
import CreateFileDialog from "../files/dialog/CreateFileDialog";

interface Props {
  plugins: BaseFilePlugin[];
}

export default function NasMenus(props: Props) {
  const { nas } = useContext(HomePageContext);

  const [openCreateFileDialog, setCreateFileDialog] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<BaseFilePlugin>();
  const [openFilesUpload, setOpenFilesUpload] = useState(false);
  const [openFolderUpload, setOpenFolderUpload] = useState(false);
  const [openNewFolder, setOpenNewFolder] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);

  return (
    <div>
      <ContextMenu id="folder">
        <Menu id="folder" vertical>
          <MenuItem
            onClick={() => {
              setOpenNewFolder(true);
            }}
          >
            <MMenuItem>New Folder</MMenuItem>
          </MenuItem>
        </Menu>
      </ContextMenu>
      <ContextMenu id="files">
        <Menu vertical>
          <MMenuItem onClick={() => setOpenEditor(true)}>
            New Document
          </MMenuItem>
          <MMenuItem
            onClick={() => {
              setOpenFilesUpload(true);
            }}
          >
            Upload Files
          </MMenuItem>
          <MMenuItem
            onClick={() => {
              setOpenFolderUpload(true);
            }}
          >
            Upload Folder
          </MMenuItem>
        </Menu>
      </ContextMenu>
      <UploadDialog
        isDir={false}
        open={openFilesUpload}
        setOpen={setOpenFilesUpload}
      />
      <UploadDialog
        isDir={true}
        open={openFolderUpload}
        setOpen={setOpenFolderUpload}
      />
      <NewFolderDialog
        open={openNewFolder}
        setOpen={setOpenNewFolder}
      ></NewFolderDialog>
      <CreateDocumentDialog open={openEditor} setOpen={setOpenEditor} />
      <CreateFileDialog
        open={openCreateFileDialog}
        onClose={async (filename) => {
          if (filename) {
            if (selectedPlugin) {
              try {
                await selectedPlugin.createFile(
                  filename,
                  nas.currentFolder?.id
                );
                setSelectedPlugin(undefined);
                setCreateFileDialog(false);
              } catch (err) {
                alert(`cannot create file.\n${err}`);
              }
            }
          } else {
            alert("Cannot create file");
          }
        }}
      />
    </div>
  );
}
