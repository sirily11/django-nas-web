import React, { useState, useContext } from "react";
import { Button } from "semantic-ui-react";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { Document as NasDocument } from "../../../../models/Folder";
import { HomePageContext } from "../../../../models/HomeContext";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  document?: NasDocument;
}

export default function CreateDocumentDialog(props: Props) {
  const [name, setName] = useState<string | undefined>();
  const [isLoading, setIsloading] = useState(false);
  const { document } = props;
  const { nas, update } = useContext(HomePageContext);

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)} fullWidth>
      <DialogTitle>Document</DialogTitle>
      <DialogContent>
        <TextField
          color="secondary"
          value={name}
          label="You Document Title"
          onChange={e => {
            setName(e.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.setOpen(false);
          }}
        >
          close
        </Button>
        <Button
          loading={isLoading}
          color="blue"
          onClick={async () => {
            try {
              setIsloading(true);
              if (name) {
                await nas.createNewDocument(name, undefined);
                update();
                setName(undefined);
                props.setOpen(false);
                setIsloading(false);
              }
            } catch (err) {
              alert(err.toString());
              setIsloading(false);
            }
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
