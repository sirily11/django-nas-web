import React, { useContext, useState } from "react";
import AutosizeInput from "react-input-autosize";
import { DocumentContext } from "../../../models/DocumentContext";
import {
  makeStyles,
  IconButton,
  Tooltip,
  LinearProgress,
  Popper,
  ClickAwayListener,
  Paper,
  Fade,
  Slide,
  Collapse
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import { Folder, Document as NasDocument } from "../../../models/interfaces/Folder";
import MoveDialog from "./MoveDialog";
const useStyles = makeStyles(theme => ({
  notchedOutline: {
    "&:focus": {},
    border: 0,
    fontWeight: "normal",
    background: "transparent",
    fontSize: "18px",
    paddingTop: 5
  },
  button: {
    padding: "0px 5px"
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
  const [numChanges, setNumChanges] = useState(0);
  const classes = useStyles();

  if (currentDocument === undefined && !isLoading) {
    return (
      <div>
        <AutosizeInput
          id="test-input"
          className={classes.notchedOutline}
          style={{
            maxWidth: window.innerWidth * 0.8
          }}
          value={"Cannot fetch document"}
        />
      </div>
    );
  }

  return (
    <div style={{ marginTop: 15, marginLeft: 5 }}>
      <Collapse in={isLoading && !currentDocument} unmountOnExit mountOnEnter>
        <div style={{ height: 24, width: 100 }}>
          <LinearProgress
            variant="indeterminate"
            style={{ marginTop: 15, width: 100 }}
          />
        </div>
      </Collapse>
      <Collapse
        in={!isLoading || currentDocument !== undefined}
        mountOnEnter
        unmountOnExit
      >
        <div>
          <Tooltip title="Rename">
            <ClickAwayListener
              onClickAway={async () => {
                if (numChanges > 0) {
                  await saveDocument();
                  setNumChanges(0);
                }
              }}
            >
              <AutosizeInput
                id="test-input"
                className={classes.notchedOutline}
                style={{
                  maxWidth: window.innerWidth * 0.8
                }}
                value={currentDocument?.name}
                onChange={e => {
                  if (currentDocument) {
                    currentDocument.name = e.target.value;
                    setNumChanges(numChanges + 1);
                    updateDocument(currentDocument);
                  }
                }}
              />
            </ClickAwayListener>
          </Tooltip>
          {currentDocument?.show_in_folder && (
            <Tooltip title="Move">
              <IconButton
                className={classes.button}
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
          )}
        </div>
      </Collapse>

      {anchorEl && (
        <ClickAwayListener onClickAway={() => setAnchorEl(undefined)}>
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            style={{ zIndex: 2000 }}
            placement="right-end"
          >
            {currentDocument && (
              <MoveDialog
                currentFile={currentDocument}
                onClose={() => setAnchorEl(undefined)}
                onMove={async (file: NasDocument, dest) => {
                  await nas.moveDocument(file.id, dest.id);
                  currentDocument.parent = dest.id;
                  updateDocument(currentDocument);
                }}
              />
            )}
          </Popper>
        </ClickAwayListener>
      )}
    </div>
  );
}
