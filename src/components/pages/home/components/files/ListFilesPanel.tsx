/** @format */

import React, { useContext, useState } from "react";
import {
  Icon,
  Modal,
  SemanticICONS,
  Dropdown,
  CardContent,
} from "semantic-ui-react";

import DeleteIcon from "@material-ui/icons/Delete";
import {
  TableContainer,
  TableHead,
  Table,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
  TableBody,
  IconButton,
  Popper,
  Paper,
  CardMedia,
  Card,
  CardActionArea,
  Checkbox,
  Toolbar,
  Tooltip,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { HomePageContext } from "../../../../models/HomeContext";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";
import path from "path";
import FileSaver, { saveAs } from "file-saver";
import "video-react/dist/video-react.css";
import {
  Folder,
  Document as NasDocument,
  File as NasFile,
} from "../../../../models/interfaces/Folder";
import Editor from "../documents/Editor";
import {
  downloadURL,
  fileURL,
  downloadMultipleURL,
} from "../../../../models/urls";
import { Grid } from "semantic-ui-react";
import FilesActions from "./FilesActions";
import RenameDialog from "./dialog/RenameDialog";
import { formatBytes } from "./utils";
import PDFViewer from "../../../../models/Plugins/file plugins/plugins/pdf/PDFViewer";
import { Dialog } from "@material-ui/core";
import MoveDialog from "../../../document/components/MoveDialog";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Musicplayer from "./music/Musicplayer";
import GetAppIcon from "@material-ui/icons/GetApp";
import Axios from "axios";
import fileDownload from "js-file-download";
import { convertCaptionURL } from "../../../../models/urls";
import { FileActionContext } from "../../../../models/FileActionContext";
import { MusicFilePlugin } from "../../../../models/Plugins/file plugins/plugins/MusicFilePlugin";
import { BaseFilePlugin } from "../../../../models/Plugins/file plugins/BaseFilePlugin";
import { videoExt } from "../../../../models/Plugins/file plugins/plugins/VideoFilePlugin";
import { imageExt } from "../../../../models/Plugins/file plugins/plugins/ImageFilePlugin";

function isImage(filepath: string): boolean {
  return imageExt.includes(path.extname(filepath));
}

function isVideo(filepath: string): boolean {
  return videoExt.includes(path.extname(filepath));
}

function getIcon(filepath: string): SemanticICONS {
  if (isImage(filepath)) {
    return "images";
  } else if (isVideo(filepath)) {
    return "file video";
  }

  return "file";
}

export default function ListFilesPanel(props: { plugins: BaseFilePlugin[] }) {
  const { plugins } = props;
  const {
    nas,
    isLoading,
    update,
    selectedDocument,

    selectDocument,
    fetch,
  } = useContext(HomePageContext);
  const {
    openMenu,
    renderMenu,
    currentFile,
    showRenameDialog,
    showMoveToDialog,
    closeMoveToDialog,
    closeRenameDialog,
  } = useContext(FileActionContext);
  const [previewAnchor, setPreviewAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<NasFile>();
  const [selectedFiles, setSelectedFiles] = useState<NasFile[]>([]);
  const [onHoverFile, setOnHoverFile] = useState<NasFile>();
  const [showMultiMoveDialog, setShowMultiMoveDialog] = useState(false);

  const handleClosePreview = () => {
    setPreviewAnchor(null);
  };

  const onClose = React.useCallback(async (promise?: Promise<any>) => {
    setSelectedFile(undefined);
    if (promise) {
      await promise;
      await fetch(nas.currentFolder?.id);
    }
  }, []);

  return (
    <div id="file-list">
      <Grid>
        <FilesActions />
        <Toolbar>
          <div>
            {selectedFiles.length === 0 ? (
              <h2>Files</h2>
            ) : (
              <h2>Selected {selectedFiles.length} files</h2>
            )}
          </div>
          {selectedFiles.length === 0 ? (
            <div> </div>
          ) : (
            <div>
              <Tooltip title="Download files">
                <IconButton
                  aria-label="download"
                  onClick={async () => {
                    try {
                      let res = await Axios.post(
                        `${downloadMultipleURL}`,
                        selectedFiles.map((f) => f.id)
                      );
                      const link = document.createElement("a");
                      link.href = `${res.data.download_url}`;
                      console.log(link.href);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } catch (err) {
                      alert(err);
                    }
                  }}
                >
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  aria-label="delete"
                  onClick={async () => {
                    let confirm = window.confirm(
                      "Do you want to delete these files?"
                    );
                    if (confirm) {
                      for (let file of selectedFiles) {
                        await nas.deleteFile(file.id, false);
                        update();
                      }
                      setSelectedFiles([]);
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Move To">
                <IconButton
                  aria-label="Move To"
                  onClick={async () => {
                    setShowMultiMoveDialog(true);
                  }}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </Toolbar>
        <Grid.Row style={{ overflow: "auto", overflowX: "hidden" }}>
          {/** Render files */}
          {nas.currentFolder && nas.currentFolder.files.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (nas.currentFolder)
                              setSelectedFiles(nas.currentFolder.files);
                          } else {
                            setSelectedFiles([]);
                          }
                          update();
                        }}
                        checked={
                          selectedFiles.length ===
                          nas.currentFolder.files.length
                        }
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Last Modify</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nas.currentFolder.files.map((f, i) => (
                    <TableRow
                      key={`file-${i}`}
                      hover
                      selected={selectedFiles.includes(f)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedFiles.includes(f)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              selectedFiles.push(f);
                            } else {
                              let index = selectedFiles.indexOf(f);
                              selectedFiles.splice(index, 1);
                            }
                            update();
                            setSelectedFiles(selectedFiles);
                          }}
                        />
                      </TableCell>
                      <TableCell
                        style={{ cursor: "grab" }}
                        onMouseOver={(e) => {
                          setPreviewAnchor(e.currentTarget);
                          setOnHoverFile(f);
                        }}
                        onMouseLeave={() => {
                          handleClosePreview();
                          setOnHoverFile(undefined);
                        }}
                        onClick={() => {
                          setSelectedFile(f);
                        }}
                      >
                        <Icon
                          name={getIcon(f.file)}
                          size="large"
                          color="teal"
                        />
                        {path.basename(f.filename)}
                      </TableCell>
                      <TableCell>
                        {moment(f.modified_at).format("MMM DD, YYYY")}
                      </TableCell>
                      <TableCell>{formatBytes(f.size)}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            openMenu(e.currentTarget, f, nas);
                          }}
                        >
                          <MoreHorizIcon></MoreHorizIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {/** End Render files */}
        </Grid.Row>
        {currentFile && renderMenu()}

        {/** Plugins */}
        {plugins.map((plugin, index) => {
          if (selectedFile) {
            let component = plugin.openFile({
              file: selectedFile,
              onClose: onClose,
            });

            return component;
          }
        })}
        {/** End Plugins */}
        {selectedDocument && (
          <Editor
            open={selectedDocument !== undefined}
            setOpen={(v) => {
              !v && selectDocument(undefined);
            }}
            document={selectedDocument}
          ></Editor>
        )}

        {/** MoveToDialog */}
        {currentFile && (
          <Dialog
            open={showMoveToDialog}
            scroll="paper"
            onClose={() => {
              closeMoveToDialog();
            }}
          >
            <MoveDialog
              currentFile={currentFile}
              onClose={() => {
                closeMoveToDialog();
              }}
              onMove={async (file, dest) => {
                await nas.moveFileTo(file.id, dest.id);
                update();
              }}
            />
          </Dialog>
        )}
        {/** End move to dialog */}
        {selectedFiles.length > 0 && (
          <Dialog
            open={showMultiMoveDialog}
            onClose={() => {
              setShowMultiMoveDialog(false);
            }}
          >
            <MoveDialog
              currentFile={selectedFiles[0]}
              onClose={() => {
                setSelectedFiles([]);
                setShowMultiMoveDialog(false);
              }}
              onMove={async (file, dest) => {
                for (let f of selectedFiles) {
                  await nas.moveFileTo(f.id, dest.id);
                  update();
                }
              }}
            />
          </Dialog>
        )}
        {/** rename dialog */}
        {currentFile && (
          <RenameDialog
            type="file"
            open={showRenameDialog}
            selectedFile={currentFile}
            onClose={() => {
              closeRenameDialog();
            }}
          />
        )}
        {/** end rename dialog */}
      </Grid>
      {/** Preview */}
      <Popper open={Boolean(previewAnchor)} anchorEl={previewAnchor}>
        {onHoverFile && (
          <Card style={{ padding: 10 }}>
            {isImage(onHoverFile.filename) && (
              <CardMedia
                style={{ height: 140, width: 140 }}
                image={onHoverFile.file}
              />
            )}
            {isVideo(onHoverFile.filename) ? (
              onHoverFile.cover ? (
                <CardActionArea>
                  <CardMedia
                    style={{ height: 140, width: 140 }}
                    image={onHoverFile.cover}
                  />
                  <CardContent> {formatBytes(onHoverFile.size)}</CardContent>
                </CardActionArea>
              ) : (
                <div>
                  {onHoverFile.filename} - {formatBytes(onHoverFile.size)}
                </div>
              )
            ) : (
              <div>
                {onHoverFile.filename} - {formatBytes(onHoverFile.size)}
              </div>
            )}
          </Card>
        )}
      </Popper>
      {/** end preview */}
    </div>
  );
}
