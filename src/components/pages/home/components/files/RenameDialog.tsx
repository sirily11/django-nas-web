/** @format */

import React, { useContext, useState } from "react";
import {
  Folder,
  File as NasFile,
  Document as NasDocument,
} from "../../../../models/interfaces/Folder";
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
  DialogActions,
} from "@material-ui/core";

interface Props {
  open: boolean;
  onClose(): void;
  type: "file" | "folder" | "document";
  selectedFile: NasFile | NasDocument | Folder;
}

export default function RenameDialog(props: Props) {
  const getDefaultName = () => {
    switch (props.type) {
      case "file": {
        let ext = path.extname((props.selectedFile as NasFile).filename);
        return path.basename((props.selectedFile as NasFile).filename, ext);
      }
      case "folder": {
        return (props.selectedFile as Folder).name;
      }
      default: {
        return (props.selectedFile as NasDocument).name;
      }
    }
  };

  const { nas } = useContext(HomePageContext);

  const [name, setName] = useState<string>(getDefaultName());
  return (
    <Dialog open={props.open} fullWidth>
      <DialogTitle>Rename</DialogTitle>
      <DialogContent>
        <TextField
          color="secondary"
          fullWidth
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onClose();
            setName("");
          }}
        >
          cancel
        </Button>
        <Button
          onClick={async () => {
            if (name) {
              switch (props.type) {
                case "file": {
                  let ext = path.extname(
                    (props.selectedFile as NasFile).filename
                  );
                  await nas.rename(props.selectedFile.id, `${name}${ext}`);
                  break;
                }
                case "folder": {
                  await nas.renameFolder(props.selectedFile.id, name);
                  break;
                }
                case "document": {
                  await nas.renameDocument(props.selectedFile.id, name);
                  break;
                }
              }
            }
            props.onClose();
          }}
        >
          ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
