import React, { useContext, useState } from "react";
import {
  Segment,
  MessageHeader,
  Message,
  Icon,
  Modal,
  Image,
  SemanticICONS,
  Divider,
  Label,
  Button,
  Popup
} from "semantic-ui-react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import { ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { HomePageContext } from "../../../models/HomeContext";
import moment from "moment";
import path from "path";
import "video-react/dist/video-react.css";
import { Folder, Document as NasDocument } from "../../../models/Folder";
import UpdateFolderDialog from "./UpdateFolderDialog";
import Editor from "./Editor";

const { Player } = require("video-react");

const imageExt = [".jpg", ".png", ".bmp"];
const videoExt = [".mov", ".mp4", ".avi", ".m4v"];

export default function ListPanel() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  const [selectedDocument, setSelectedDocument] = useState<
    NasDocument | undefined
  >();
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(
    undefined
  );

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
    <Segment placeholder loading={isLoading}>
      <Label attached="bottom left">
        Total Size:{" "}
        {nas.currentFolder &&
          (nas.currentFolder.total_size / 1024 / 1024).toFixed(2)}{" "}
        MB
      </Label>
      <List>
        {nas.errorMsg && (
          <Message error>
            <MessageHeader>Network Error</MessageHeader>
            <div>{nas.errorMsg.toString()}</div>
          </Message>
        )}
        {/*Render Folders*/}
        {nas.currentFolder &&
          nas.currentFolder.folders.map((f, i) => (
            <ListItem
              button
              key={`folder-${f.id}`}
              onClick={() => {
                window.location.href = `#/home/${f.id}`;
              }}
            >
              <ListItemAvatar>
                <Icon circular name="folder" size="large" color="grey"></Icon>
              </ListItemAvatar>
              <ListItemText
                primary={f.name}
                secondary={moment(f.modified_at).format("MMM DD, YYYY")}
              />

              <ListItemSecondaryAction>
                <Button.Group>
                  <Button
                    icon
                    color="blue"
                    edge="end"
                    onClick={async () => {
                      setSelectedFolder(f);
                    }}
                  >
                    <Icon name="edit"></Icon>
                  </Button>
                  <Button
                    icon
                    edge="end"
                    onClick={async () => {
                      await nas.deleteFolder(f.id);
                      update();
                    }}
                  >
                    <Icon name="trash"></Icon>
                  </Button>
                </Button.Group>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        {/*End Render Folders*/}
        {/*Render documents*/}
        {nas.currentFolder &&
          nas.currentFolder.documents.map((f, i) => (
            <ListItem
              button
              key={`folder-${f.id}`}
              onClick={async () => {
                let document = await nas.getDocument(f.id);
                setSelectedDocument(document);
              }}
            >
              <ListItemAvatar>
                <Icon circular name="file pdf" size="large" color="red"></Icon>
              </ListItemAvatar>
              <ListItemText
                primary={f.name}
                secondary={moment(f.modified_at).format("MMM DD, YYYY")}
              />

              <ListItemSecondaryAction>
                <Button.Group>
                  <Button
                    icon
                    color="blue"
                    edge="end"
                    onClick={async () => {
                      let document = await nas.getDocument(f.id);
                      setSelectedDocument(document);
                    }}
                  >
                    <Icon name="edit"></Icon>
                  </Button>
                  <Button
                    icon
                    edge="end"
                    onClick={async () => {
                      await nas.deleteDocument(f.id);
                      update();
                    }}
                  >
                    <Icon name="trash"></Icon>
                  </Button>
                </Button.Group>
              </ListItemSecondaryAction>
            </ListItem>
          ))}

        {/*End Render documents*/}

        {/*Render Files*/}
        {nas.currentFolder &&
          nas.currentFolder.files.map((f, i) => (
            <ListItem
              button
              onClick={() => {
                if (isImage(f.file)) {
                  setImageSrc(f.file);
                } else if (isVideo(f.file)) {
                  console.log(f.file);
                  setVideoSrc(f.file);
                }
              }}
              key={`file-${f.id}`}
            >
              <ListItemAvatar>
                <Icon
                  name={getIcon(f.file)}
                  circular
                  size="large"
                  color="teal"
                />
              </ListItemAvatar>
              <ListItemText
                primary={path.basename(f.filename)}
                secondary={
                  <React.Fragment>
                    <label>
                      {moment(f.modified_at).format("MMM DD, YYYY")}
                    </label>
                    <p> {(f.size / 1024 / 1024).toFixed(2)}MB </p>
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <Button.Group>
                  <Button
                    icon
                    edge="end"
                    color="blue"
                    aria-label="download"
                    onClick={() => {
                      /// Download from link
                      const link = document.createElement("a");
                      link.href = `${f.file}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Icon name="download"></Icon>
                  </Button>

                  <Button
                    icon
                    onClick={async () => {
                      await nas.deleteFile(f.id);
                      update();
                    }}
                  >
                    <Icon name="trash"></Icon>
                  </Button>
                </Button.Group>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        {/*End Render Files*/}
      </List>

      {selectedFolder && (
        <UpdateFolderDialog
          selectedFolder={selectedFolder}
          open={selectedFolder !== undefined}
          setOpen={(value: boolean) => {
            !value && setSelectedFolder(undefined);
          }}
        />
      )}
      {selectedDocument && (
        <Editor
          open={selectedDocument !== undefined}
          setOpen={v => {
            !v && setSelectedDocument(undefined);
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
        <Player>
          <source src={videoSrc} />
        </Player>
      </Modal>
    </Segment>
  );
}
