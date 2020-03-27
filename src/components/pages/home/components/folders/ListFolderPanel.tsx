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
  Popup,
  Grid
} from "semantic-ui-react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { HomePageContext } from "../../../../models/HomeContext";
import moment from "moment";
import path from "path";
import "video-react/dist/video-react.css";
import { Folder, Document as NasDocument } from "../../../../models/Folder";
import UpdateFolderDialog from "./UpdateFolderDialog";

import { NavLink } from "react-router-dom";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const { Player } = require("video-react");

const imageExt = [".jpg", ".png", ".bmp", ".JPG", ".gif"];
const videoExt = [".mov", ".mp4", ".avi", ".m4v", ".MOV"];

export default function ListPanel() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(
    undefined
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        overflow: "auto",
        overflowX: "hidden",
        height: "100%",
        color: "blue"
      }}
    >
      <List>
        <Grid centered>
          <Grid.Row verticalAlign="middle">
            <Grid.Column width={5}>
              {nas.currentFolder && nas.currentFolder.parent ? (
                <IconButton>
                  <NavLink to={`/home/${nas.currentFolder.parent}`}>
                    <ArrowBackIosIcon />
                  </NavLink>
                </IconButton>
              ) : (
                <IconButton>
                  <NavLink to={`/home`}>
                    <ArrowBackIosIcon />
                  </NavLink>{" "}
                </IconButton>
              )}
            </Grid.Column>
            <Grid.Column width={11}>
              <div style={{ color: "black" }}>
                {nas.currentFolder && nas.currentFolder.name}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {nas.errorMsg && (
          <Message error>
            <MessageHeader>Network Error</MessageHeader>
            <div>{nas.errorMsg.toString()}</div>
          </Message>
        )}
        {/*Render Folders*/}
        {nas.currentFolder &&
          nas.currentFolder.folders.map((f, i) => (
            <ListItem button key={`folder-${f.id}`}>
              <ListItemAvatar>
                <Icon name="folder" size="large" color="grey"></Icon>
              </ListItemAvatar>
              <ListItemText
                onClick={() => {
                  window.location.href = `#/home/${f.id}`;
                }}
                style={{ color: "black" }}
                primary={f.name}
                secondary={moment(f.modified_at).format("MMM DD, YYYY")}
              />
              {/** folder menu button */}
              <ListItemSecondaryAction>
                <IconButton onClick={handleClick}>
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    setSelectedFolder(f);
                    handleClose();
                  }}
                >
                  Rename
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    await nas.deleteFolder(f.id);
                    handleClose();
                    update();
                  }}
                >
                  Delete
                </MenuItem>
                <MenuItem onClick={handleClose}>Move To</MenuItem>
              </Menu>
              {/** end folder menu button */}
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
    </div>
  );
}
