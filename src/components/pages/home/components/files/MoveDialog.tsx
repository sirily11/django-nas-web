import React, { useContext, useState } from "react";
import {
  Folder,
  File as NasFile,
  Document as NasDocument
} from "../../../../models/Folder";
import { HomePageContext } from "../../../../models/HomeContext";
import * as path from "path";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  DialogActions
} from "@material-ui/core";

interface Props {
  open: boolean;
  onClose(): void;
  type: "file" | "folder" | "document";
  selectedFile: NasFile | NasDocument | Folder;
}

export default function MoveDialog(props: Props) {
  const { nas } = useContext(HomePageContext);

  const [selection, setSelection] = useState<number>(-1);
  console.log(selection);
  return (
    <Dialog open={props.open} fullWidth>
      <DialogTitle>Move File To</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Destnation</InputLabel>
          <Select
            color="secondary"
            value={selection}
            onChange={e => {
              let selection = e.target.value as number;
              setSelection(selection);
            }}
            fullWidth
          >
            {nas.currentFolder && (
              <MenuItem value={nas.currentFolder.parent ?? -1}>
                Parent Folder
              </MenuItem>
            )}
            {nas.currentFolder &&
              nas.currentFolder.folders
                .filter(f =>
                  props.type === "folder"
                    ? props.selectedFile.id !== f.id
                    : true
                )
                .map(f => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setSelection(-1);
            props.onClose();
          }}
        >
          cancel
        </Button>
        <Button
          onClick={async () => {
            if (selection) {
              let s = selection === -1 ? null : selection;
              switch (props.type) {
                case "file":
                  await nas.moveFileTo(props.selectedFile.id, s);
                  break;
                case "folder":
                  await nas.moveFolderTo(props.selectedFile.id, s);
              }
            }
            setSelection(-1);
            props.onClose();
          }}
        >
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
