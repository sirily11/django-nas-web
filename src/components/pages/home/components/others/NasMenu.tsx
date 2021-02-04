/** @format */

import React, { useContext, useState } from "react";
import { HomePageContext } from "../../../../models/HomeContext";
import UploadDialog from "../files/dialog/UploadDialog";
import NewFolderDialog from "../folders/NewFolderDialog";
import CreateDocumentDialog from "../documents/CreateDocumentDialog";
import { BaseFilePlugin } from "../../../../models/Plugins/file plugins/BaseFilePlugin";
import CreateFileDialog from "../files/dialog/CreateFileDialog";
import {
  ContextMenuContext,
  ContextMenuType,
} from "../../../../models/contextMenu/ContextMenuContext";
import ContextMenu from "../../../../models/contextMenu/ContextMenu";
import { MenuItem } from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";

interface Props {
  plugins: BaseFilePlugin[];
}

export default function NasMenus(props: Props) {
  const { nas, fetch } = useContext(HomePageContext);

  const { plugins } = props;
  const [openCreateFileDialog, setCreateFileDialog] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<BaseFilePlugin>();
  const [openFilesUpload, setOpenFilesUpload] = useState(false);
  const [openFolderUpload, setOpenFolderUpload] = useState(false);
  const [openNewFolder, setOpenNewFolder] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const { closeContextMenu } = React.useContext(ContextMenuContext);

  return (
    <div>
      <ContextMenu contextMenuType={ContextMenuType.folder}>
        {() => (
          <MenuItem
            onClick={() => {
              closeContextMenu();
              setOpenNewFolder(true);
            }}
          >
            New Folder
          </MenuItem>
        )}
      </ContextMenu>

      <ContextMenu contextMenuType={ContextMenuType.file}>
        {(show) => (
          <div>
            <NestedMenuItem
              label={"Create File With Plugin"}
              parentMenuOpen={show}
            >
              {plugins
                .filter((p) => p.canCreateFile())
                .map((plugin, index) => (
                  <MenuItem
                    key={`plugin-${index}`}
                    onClick={() => {
                      setSelectedPlugin(plugin);
                      closeContextMenu();
                      setCreateFileDialog(true);
                    }}
                  >
                    {plugin.getPluginName()}
                  </MenuItem>
                ))}
            </NestedMenuItem>
            <MenuItem onClick={() => setOpenEditor(true)}>
              New Document
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeContextMenu();
                setOpenFilesUpload(true);
              }}
            >
              Upload Files
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeContextMenu();
                setOpenFolderUpload(true);
              }}
            >
              Upload Folder
            </MenuItem>
          </div>
        )}
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
                await fetch(nas.currentFolder?.id);
              } catch (err) {
                alert(`cannot create file.\n${err}`);
              }
            }
          }
          setSelectedPlugin(undefined);
          setCreateFileDialog(false);
        }}
      />
    </div>
  );
}
