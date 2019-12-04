import React, { useState, useContext } from "react";
import EditorJs from "react-editor-js";
import { Modal, Button } from "semantic-ui-react";
import { TextField } from "@material-ui/core";
import { Document as NasDocument } from "../../../models/Folder";
import { HomePageContext } from "../../../models/HomeContext";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  document?: NasDocument;
}

export default function Editor(props: Props) {
  const { document } = props;
  const {} = useContext(HomePageContext);

  return (
    <Modal open={props.open} centered={false}>
      <Modal.Header>
        <TextField
          defaultValue={document && document.name}
          label="You Document Title"
          fullWidth
        />
      </Modal.Header>
      <Modal.Content>
        <EditorJs></EditorJs>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            props.setOpen(false);
          }}
        >
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
