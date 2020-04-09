import React, { useContext, useState } from "react";
import { DocumentContext } from "../../../models/DocumentContext";
import {
  makeStyles,
  IconButton,
  Tooltip,
  LinearProgress,
  Popper,
  ClickAwayListener,
  Paper
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import { Folder, Document as NasDocument } from "../../../models/Folder";
import MoveDialog from "./MoveDialog";
const useStyles = makeStyles(theme => ({
  notchedOutline: {
    "&:focus": {},
    border: 0,
    fontWeight: "normal",
    background: "transparent",
    fontSize: "20px"
  }
}));

export default function Titlebar() {
  const {
    currentDocument,
    updateDocument,
    saveDocument,
    isLoading,
    nas,
    update
  } = useContext(DocumentContext);

  const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>();
  const classes = useStyles();

  if (currentDocument === undefined) {
    return (
      <div style={{ height: 24, width: 100 }}>
        <LinearProgress
          variant="indeterminate"
          style={{ marginTop: 15, width: 100 }}
        />
      </div>
    );
  }
  return (
    <div style={{ marginTop: 5 }}>
      <Tooltip title="Rename">
        <input
          className={classes.notchedOutline}
          style={{
            width: (currentDocument.name.length + 5) * 8.5,
            maxWidth: window.innerWidth * 0.8
          }}
          value={currentDocument.name}
          onChange={e => {
            currentDocument.name = e.target.value;
            updateDocument(currentDocument);
          }}
          onBlur={async () => {
            await saveDocument();
          }}
        />
      </Tooltip>
      <Tooltip title="Move">
        <IconButton
          style={{ verticalAlign: "sub" }}
          onClick={async e => {
            setAnchorEl(e.currentTarget);
            if (currentDocument) {
              await nas.getContent(currentDocument.parent as number);
            }

            update();
          }}
        >
          <FolderIcon />
        </IconButton>
      </Tooltip>
      <span style={{ textDecoration: "underline", color: "grey" }}>
        {isLoading ? "Commnucating with server" : "All changes saved in Drive"}
      </span>
      {anchorEl && (
        <ClickAwayListener onClickAway={() => setAnchorEl(undefined)}>
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            style={{ zIndex: 2000 }}
            placement="right-end"
          >
            <MoveDialog onClose={() => setAnchorEl(undefined)} />
          </Popper>
        </ClickAwayListener>
      )}
    </div>
  );
}
