import React, { useState, useContext } from "react";
import EditorJs from "react-editor-js";
import { Modal, Button } from "semantic-ui-react";
import { TextField } from "@material-ui/core";
import { Document as NasDocument } from "../../../models/Folder";
import { HomePageContext } from "../../../models/HomeContext";
import EditorJS from "@editorjs/editorjs";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  document?: NasDocument;
}

export default function Editor(props: Props) {
  const [editor, setEditor] = useState<EditorJS | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [isChanged, setIsChanged] = useState(false);
  const { document } = props;
  const { nas, update } = useContext(HomePageContext);

  if (name === undefined) {
    setName(document ? document.name : "");
  }

  return (
    <Modal open={props.open} centered={false}>
      <Modal.Header>
        <TextField
          value={name}
          label="You Document Title"
          onChange={e => {
            setName(e.target.value);
          }}
          fullWidth
        />
      </Modal.Header>
      <Modal.Content>
        <EditorJs
          onChange={() => {
            setIsChanged(true);
          }}
          data={document && document.content}
          instanceRef={instance => setEditor(instance)}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            if (isChanged) {
              let confirm = window.confirm(
                "Are you sure you want to exit? You will lose unsave data."
              );
              if (confirm) {
                props.setOpen(false);
              }
            } else {
              props.setOpen(false);
            }
          }}
        >
          close
        </Button>
        <Button
          color="blue"
          onClick={async () => {
            try {
              if (editor && name) {
                let data = await editor.save();
                if (document) {
                  // update current document
                  await nas.updateDocument(document.id, name, data);
                } else {
                  if (name !== "") {
                    await nas.createNewDocument(name, data);
                  } else {
                    throw "Name should not be empty";
                  }
                }
                update();
                setName(undefined);
                props.setOpen(false);
              }
            } catch (err) {
              alert(err.toString());
            }
          }}
        >
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
