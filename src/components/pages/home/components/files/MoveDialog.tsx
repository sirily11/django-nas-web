import React, { useContext, useState } from "react";
import {
  Folder,
  File as NasFile,
  Document as NasDocument
} from "../../../../models/Folder";
import { HomePageContext } from "../../../../models/HomeContext";
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
  const [selection, setSelection] = useState<number>();

  return (
    <Dialog open={props.open} fullWidth>
      <DialogTitle>Move File To</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Destnation</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selection}
            onChange={e => {
              setSelection(e.target.value as number);
            }}
            fullWidth
          >
            {nas.currentFolder && (
              <MenuItem value={nas.currentFolder.parent}>
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
                .map(f => <MenuItem value={f.id}>{f.name}</MenuItem>)}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setSelection(undefined);
            props.onClose();
          }}
        >
          cancel
        </Button>
        <Button
          onClick={async () => {
            if (selection) {
              switch (props.type) {
                case "file":
                  await nas.moveFileTo(props.selectedFile.id, selection);
                  break;
                case "folder":
                  await nas.moveFolderTo(props.selectedFile.id, selection);
              }
            }
            setSelection(undefined);
            props.onClose();
          }}
        >
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
