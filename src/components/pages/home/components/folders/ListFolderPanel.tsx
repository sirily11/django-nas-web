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
import "video-react/dist/video-react.css";
import { Folder, Document as NasDocument } from "../../../../models/Folder";

import { NavLink } from "react-router-dom";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import MoveDialog from "../files/MoveDialog";
import RenameDialog from "../files/RenameDialog";

export default function ListPanel() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  const [showMoveToDialog, setShowMoveToDialog] = useState(false);
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
                <NavLink to={`/home/${nas.currentFolder.parent}`}>
                  <IconButton>
                    <ArrowBackIosIcon />
                  </IconButton>
                </NavLink>
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
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setShowMoveToDialog(true);
                    setSelectedFolder(f);
                  }}
                >
                  Move To
                </MenuItem>
              </Menu>
              {/** end folder menu button */}
            </ListItem>
          ))}
        {/*End Render Folders*/}
      </List>

      {selectedFolder && !showMoveToDialog && (
        <RenameDialog
          type="folder"
          selectedFile={selectedFolder}
          open={selectedFolder !== undefined}
          onClose={() => setSelectedFolder(undefined)}
        />
      )}

      {selectedFolder && (
        <MoveDialog
          type="folder"
          selectedFile={selectedFolder}
          open={showMoveToDialog}
          onClose={() => {
            setShowMoveToDialog(false);
            setSelectedFolder(undefined);
          }}
        />
      )}
    </div>
  );
}
