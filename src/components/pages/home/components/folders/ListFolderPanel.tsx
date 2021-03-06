/** @format */

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
  Grid,
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
  MenuItem,
  Collapse,
  Dialog,
} from "@material-ui/core";
import { HomePageContext } from "../../../../models/HomeContext";
import moment from "moment";
import Axios from "axios";
import "video-react/dist/video-react.css";
import {
  Folder,
  Document as NasDocument,
} from "../../../../models/interfaces/Folder";

import { NavLink } from "react-router-dom";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import RenameDialog from "../files/dialog/RenameDialog";
import { downloadURL } from "../../../../models/urls";
import MoveDialog from "../../../document/components/MoveDialog";

export default function ListPanel() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  const [showMoveToDialog, setShowMoveToDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
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
        color: "blue",
      }}
    >
      <List>
        <Grid centered>
          <Grid.Row verticalAlign="middle">
            <Grid.Column width={5}>
              <IconButton
                onClick={() => {
                  window.location.href = `#/home/${
                    nas.currentFolder?.parent ?? ""
                  }`;
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
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
        <Collapse in={!isLoading} timeout={300}>
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
                  <IconButton
                    onClick={(e) => {
                      handleClick(e);
                      setSelectedFolder(f);
                    }}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </ListItemSecondaryAction>

                {/** end folder menu button */}
              </ListItem>
            ))}
        </Collapse>
        {/*End Render Folders*/}
      </List>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            setShowRenameDialog(true);
            handleClose();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (selectedFolder) {
              let response = await Axios.post(
                `${downloadURL}${selectedFolder.id}`
              );

              const link = document.createElement("a");
              link.href = `${response.data.download_url}`;
              console.log(link.href);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          Download Folder
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (selectedFolder) {
              await nas.deleteFolder(selectedFolder.id);
              handleClose();
              update();
              setSelectedFolder(undefined);
            }
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setShowMoveToDialog(true);
          }}
        >
          Move To
        </MenuItem>
      </Menu>

      {selectedFolder && showRenameDialog && (
        <RenameDialog
          type="folder"
          selectedFile={selectedFolder}
          open={showRenameDialog}
          onClose={() => {
            setSelectedFolder(undefined);
            setShowRenameDialog(false);
          }}
        />
      )}

      {selectedFolder && showMoveToDialog && (
        <Dialog
          open={showMoveToDialog}
          onClose={() => {
            setShowMoveToDialog(false);
            setSelectedFolder(undefined);
          }}
        >
          <MoveDialog
            currentFile={selectedFolder}
            onClose={() => {
              setShowMoveToDialog(false);
              setSelectedFolder(undefined);
            }}
            onMove={async (file, dest) => {
              if (file.id === dest.id) {
                throw Error("Cannot move to this place");
              }
              await nas.moveFolderTo(file.id, dest.id);
              update();
            }}
          />
        </Dialog>
      )}
    </div>
  );
}
