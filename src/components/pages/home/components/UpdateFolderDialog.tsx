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
import { Folder } from "../../../models/Folder";

interface Props {
  selectedFolder: Folder;
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

export default function UpdateFolderDialog(props: Props) {
  const { nas, update } = useContext(HomePageContext);

  return (
    <Modal open={props.open}>
      <Modal.Header>Select files</Modal.Header>
      <Modal.Content>
        <JSONSchema
          schemas={schema}
          url=""
          values={{ name: props.selectedFolder.name }}
          onSubmit={async data => {
            try {
              await nas.renameFolder(props.selectedFolder.id, data);
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
