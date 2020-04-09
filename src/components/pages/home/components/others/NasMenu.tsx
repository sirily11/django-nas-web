import React, { useContext, useState } from "react";
import {
  Button,
  Icon,
  Grid,
  Breadcrumb,
  Segment,
  Card,
  MenuItem as MMenuItem
} from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { HomePageContext } from "../../../../models/HomeContext";
import UploadDialog from "../files/UploadDialog";
import NewFolderDialog from "../folders/NewFolderDialog";
import Editor from "../documents/Editor";
import { ContextMenu, MenuItem } from "react-contextmenu";

import { Menu } from "semantic-ui-react";
import CreateDocumentDialog from "../documents/CreateDocumentDialog";

export default function NasMenus() {
  const { nas } = useContext(HomePageContext);

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
    </div>
  );
}
