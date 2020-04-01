import React, { useContext, useState } from "react";
import {
  Segment,
  MessageHeader,
  Message,
  Icon,
  Modal,
  Image,
  SemanticICONS,
  Dropdown,
  CardContent
} from "semantic-ui-react";
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
  CardActionArea
} from "@material-ui/core";
import { HomePageContext } from "../../../../models/HomeContext";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";
import path from "path";
import "video-react/dist/video-react.css";
import {
  Folder,
  Document as NasDocument,
  File as NasFile
} from "../../../../models/Folder";
import Editor from "../documents/Editor";
import { downloadURL } from "../../../../models/urls";
import { Grid } from "semantic-ui-react";
import FilesActions from "./FilesActions";
import MoveDialog from "./MoveDialog";
import RenameDialog from "./RenameDialog";
import { formatBytes } from "./utils";

const { Player } = require("video-react");

const imageExt = [".jpg", ".png", ".bmp", ".JPG", ".gif", ".jpeg", ".JPEG"];
const videoExt = [".mov", ".mp4", ".avi", ".m4v", ".MOV", ".MP4"];

export default function ListFilesPanel() {
  const {
    nas,
    isLoading,
    update,
    selectedDocument,
    selectDocument
  } = useContext(HomePageContext);
  const [previewAnchor, setPreviewAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const [onHoverFile, setOnHoverFile] = useState<NasFile>();
  const [selectedFile, setselectedFile] = useState<NasFile>();
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showMoveToDialog, setShowMoveToDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [videoSrc, setVideoSrc] = useState<
    { src: string; cover: string } | undefined
  >(undefined);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClosePreview = () => {
    setPreviewAnchor(null);
  };

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

  return (
    <div id="file-list">
      <Grid>
        <FilesActions />
        <Grid.Row style={{ overflow: "auto", overflowX: "hidden" }}>
          {/** Render files */}
          {nas.currentFolder && nas.currentFolder.files.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Last Modify</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nas.currentFolder.files.map((f, i) => (
                    <TableRow hover>
                      <TableCell
                        style={{ cursor: "grab" }}
                        onMouseOver={e => {
                          setPreviewAnchor(e.currentTarget);
                          setOnHoverFile(f);
                        }}
                        onMouseLeave={() => {
                          handleClosePreview();
                          setOnHoverFile(undefined);
                        }}
                        onClick={() => {
                          if (isImage(f.file)) {
                            setImageSrc(f.file);
                          } else if (isVideo(f.file)) {
                            setVideoSrc({
                              src: f.transcode_filepath ?? f.file,
                              cover: f.cover
                            });
                          }
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
                          onClick={e => {
                            setselectedFile(f);
                            handleClick(e);
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
        {/** File Action Menu */}
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              /// Download from link
              if (selectedFile) {
                const link = document.createElement("a");
                link.href = `${selectedFile.file}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
              handleClose();
            }}
          >
            Download
          </MenuItem>
          <MenuItem
            onClick={async () => {
              if (selectedFile) {
                handleClose();
                setShowRenameDialog(true);
              }
            }}
          >
            Rename
          </MenuItem>
          <MenuItem
            onClick={async () => {
              if (selectedFile) {
                await nas.deleteFile(selectedFile.id);
                handleClose();
                update();
              }
            }}
          >
            Delete
          </MenuItem>
          <MenuItem
            onClick={async () => {
              if (selectedFile) {
                handleClose();
                setShowMoveToDialog(true);
              }
            }}
          >
            Move To
          </MenuItem>
        </Menu>
        {/** end file action menu */}
        {selectedDocument && (
          <Editor
            open={selectedDocument !== undefined}
            setOpen={v => {
              !v && selectDocument(undefined);
            }}
            document={selectedDocument}
          ></Editor>
        )}
        <Modal
          open={imageSrc !== undefined}
          onClose={() => setImageSrc(undefined)}
        >
          <Image src={imageSrc} fluid></Image>
        </Modal>
        <Modal
          open={videoSrc !== undefined}
          onClose={() => setVideoSrc(undefined)}
        >
          <Player poster={videoSrc && videoSrc.cover}>
            <source src={videoSrc && videoSrc.src} />
          </Player>
        </Modal>
        {selectedFile && (
          <MoveDialog
            type="file"
            open={showMoveToDialog}
            selectedFile={selectedFile}
            onClose={() => {
              setShowMoveToDialog(false);
            }}
          />
        )}
        {selectedFile && (
          <RenameDialog
            type="file"
            open={showRenameDialog}
            selectedFile={selectedFile}
            onClose={() => {
              setShowRenameDialog(false);
              setselectedFile(undefined);
            }}
          />
        )}
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
            {isVideo(onHoverFile.filename) &&
              (onHoverFile.cover ? (
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
              ))}
          </Card>
        )}
      </Popper>
      {/** end preview */}
    </div>
  );
}
