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
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { HomePageContext } from "../../../models/HomeContext";
import moment from "moment";
import path from "path";
import "video-react/dist/video-react.css";
import { Folder, Document as NasDocument } from "../../../models/Folder";
import UpdateFolderDialog from "./UpdateFolderDialog";
import Editor from "./Editor";
import { downloadURL } from "../../../models/urls";
import Axios from "axios";
import { NavLink } from "react-router-dom";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const { Player } = require("video-react");

const imageExt = [".jpg", ".png", ".bmp", ".JPG", ".gif"];
const videoExt = [".mov", ".mp4", ".avi", ".m4v", ".MOV"];

export default function ListPanel() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  const [selectedDocument, setSelectedDocument] = useState<
    NasDocument | undefined
  >();
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [videoSrc, setVideoSrc] = useState<
    { src: string; cover: string } | undefined
  >(undefined);
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
    <div
      style={{
        overflow: "auto",
        height: "100%",
        color: "blue"
      }}
    >
      <List>
        {nas.currentFolder && nas.currentFolder.parent ? (
          <IconButton>
            {" "}
            <NavLink to={`/home/${nas.currentFolder.parent}`}>
              <ArrowBackIosIcon />
            </NavLink>{" "}
          </IconButton>
        ) : (
          <IconButton>
            {" "}
            <NavLink to={`/home`}>
              <ArrowBackIosIcon />
            </NavLink>{" "}
          </IconButton>
        )}

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
                <Icon name="folder" size="large" color="grey"></Icon>
              </ListItemAvatar>
              <ListItemText
                style={{ color: "black" }}
                primary={f.name}
                secondary={moment(f.modified_at).format("MMM DD, YYYY")}
              />

              <ListItemSecondaryAction>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        {/*End Render Folders*/}
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
        <Player poster={videoSrc && videoSrc.cover}>
          <source src={videoSrc && videoSrc.src} />
        </Player>
      </Modal>
    </div>
  );
}
