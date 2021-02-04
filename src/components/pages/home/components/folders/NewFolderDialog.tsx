/** @format */

import React, { useState, useContext } from "react";
import {
  Modal,
  Segment,
  Progress,
  Grid,
  Button,
  Icon,
} from "semantic-ui-react";
import { HomePageContext } from "../../../../models/HomeContext";
import { SchemaList, Schema, Widget } from "../../JSONSchema/model/Schema";
import { DialogContent } from "@material-ui/core";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
}

export default function NewFolderDialog(props: Props) {
  const { nas, update } = useContext(HomePageContext);
  const [folderName, setFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={props.open} fullWidth>
      <DialogTitle>New Folder</DialogTitle>
      <DialogContent>
        <TextField
          onChange={(e) => {
            setFolderName(e.target.value);
          }}
          value={folderName}
          color="secondary"
          fullWidth
          label="Folder Name"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button
          basic
          color="red"
          onClick={() => {
            props.setOpen(false);
            setFolderName("");
          }}
        >
          <Icon name="remove" /> No
        </Button>
        <Button
          basic
          color="green"
          onClick={async () => {
            setIsLoading(true);
            await nas.createNewFolder(folderName);
            update();
            setIsLoading(false);
            setFolderName("");
            props.setOpen(false);
          }}
          loading={isLoading}
        >
          <Icon name="add" /> Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
