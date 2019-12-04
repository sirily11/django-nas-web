import React, { useState, useContext } from "react";
import {
  Modal,
  Segment,
  Progress,
  Grid,
  Button,
  Icon
} from "semantic-ui-react";
import { HomePageContext } from "../../../models/HomeContext";
import { SchemaList, Schema, Widget } from "../JSONSchema/model/Schema";
import { JSONSchema } from "../JSONSchema";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
}

interface UploadInfo {
  currentName: string;
  progress: number;
  total: number;
  currentIndex: number;
}

const schema: Schema[] = [
  {
    name: "name",
    label: "Folder Name",
    readonly: false,
    required: true,
    widget: Widget.text
  }
];

export default function NewFolderDialog(props: Props) {
  const { nas, update } = useContext(HomePageContext);

  return (
    <Modal open={props.open}>
      <Modal.Header>New Folder</Modal.Header>
      <Modal.Content>
        <JSONSchema
          schemas={schema}
          url=""
          onSubmit={async data => {
            try {
              await nas.createNewFolder(data);
              update();
              setTimeout(() => {
                props.setOpen(false);
              }, 300);
            } catch (err) {
              throw err;
            }
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" onClick={() => props.setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
