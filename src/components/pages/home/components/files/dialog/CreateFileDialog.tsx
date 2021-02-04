/** @format */

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import React from "react";

interface Props {
  open: boolean;
  onClose(fileName?: string): Promise<void>;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function CreateFileDialog(props: Props) {
  const classes = useStyles();
  const [fileName, setFileName] = React.useState("");
  const { open, onClose } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const close = React.useCallback(
    async (file: string) => {
      setFileName("");
      if (file.length > 0) {
        setIsLoading(true);
        await onClose(file);
      } else {
        await onClose();
      }
      setIsLoading(false);
    },
    [open]
  );

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Create File</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          color="secondary"
          value={fileName}
          label={"File Name"}
          helperText="Your filename goes here"
          onChange={(e) => setFileName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <div className={classes.wrapper}>
          <Button
            variant="contained"
            color="secondary"
            disabled={isLoading}
            onClick={async () => {
              close(fileName);
            }}
          >
            Create
          </Button>
          {isLoading && (
            <CircularProgress
              size={24}
              className={classes.buttonProgress}
              color="secondary"
            />
          )}
        </div>
        <Button
          onClick={() => {
            close("");
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
