import React, { useContext, useState } from "react";
import {
  Segment,
  MessageHeader,
  Message,
  Icon,
  Modal,
  Image,
  SemanticICONS
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
  IconButton
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

const { Player } = require("video-react");

const imageExt = [".jpg", ".png", ".bmp", ".JPG", ".gif"];
const videoExt = [".mov", ".mp4", ".avi", ".m4v", ".MOV", ".MP4"];

export default function ListFilesPanel() {
  const {
    nas,
    isLoading,
    update,
    selectedDocument,
    selectDocument
  } = useContext(HomePageContext);
  const [selectedFile, setselectedFile] = useState<NasFile>();
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
    <Grid style={{ height: "100%", overflow: "auto", overflowX: "hidden" }}>
      <Grid.Row style={{ height: "auto" }}>
        <FilesActions />
      </Grid.Row>
      <Grid.Row style={{ overflow: "auto", overflowX: "hidden" }}>
        {nas.errorMsg && (
          <Message error>
            <MessageHeader>Network Error</MessageHeader>
            <div>{nas.errorMsg.toString()}</div>
          </Message>
        )}
        {/** Render files */}
        {nas.currentFolder && nas.currentFolder.files.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Last Modify</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nas.currentFolder.files.map((f, i) => (
                  <TableRow hover>
                    <TableCell
                      style={{ cursor: "grab" }}
                      onClick={() => {
                        if (isImage(f.file)) {
                          setImageSrc(f.file);
                        } else if (isVideo(f.file)) {
                          setVideoSrc({ src: f.file, cover: f.cover });
                        }
                      }}
                    >
                      <Icon name={getIcon(f.file)} size="large" color="teal" />
                      {path.basename(f.filename)}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {moment(f.modified_at).format("MMM DD, YYYY")}
                    </TableCell>
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
        <MenuItem onClick={handleClose}>Move To</MenuItem>
      </Menu>

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
    </Grid>
  );
}
