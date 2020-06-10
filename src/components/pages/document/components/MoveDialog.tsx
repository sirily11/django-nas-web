import React, { useContext, useState } from "react";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardActions,
  IconButton,
  CircularProgress,
  Fade,
  Collapse,
  LinearProgress,
  Tooltip,
  Divider
} from "@material-ui/core";
import { DocumentContext } from "../../../models/DocumentContext";
import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { Button } from "semantic-ui-react";
import { MovingContext } from "../../../models/MovingContext";
import {
  Folder,
  File as NasFile,
  Document as NasDocument
} from "../../../models/interfaces/Folder";

interface Props {
  currentFile: Folder | NasFile | NasDocument;
  onClose(): void;
  onMove(file: Folder | NasFile | NasDocument, dest: Folder): Promise<void>;
}

export default function MoveDialog(props: Props) {
  const { nas, update } = useContext(MovingContext);
  const { currentFile, onMove, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [loadingFolder, setLoadingFolder] = useState(
    nas.currentFolder === undefined
  );

  if (!nas.currentFolder) {
    nas
      .getContent(currentFile.parent as any)
      .then(() => {
        setLoadingFolder(false);
      })
      .catch(err => {
        alert(`${err}`);
        setLoadingFolder(false);
      });
  }

  return (
    <Card style={{ width: "400px" }}>
      <CardContent>
        <div>
          <IconButton
            disabled={nas.currentFolder?.parent === undefined}
            onClick={async () => {
              setLoadingFolder(true);
              await nas.getContent(nas.currentFolder?.parent);
              update();
              setTimeout(() => {
                setLoadingFolder(false);
              }, 500);
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          {nas.currentFolder?.name ?? "root"}
        </div>
        <Collapse in={loadingFolder} mountOnEnter unmountOnExit>
          <LinearProgress style={{ backgroundColor: "#47bcff" }} />
        </Collapse>

        <Collapse in={!loadingFolder} mountOnEnter unmountOnExit>
          <List style={{ padding: 0, maxHeight: 400, overflowY: "auto" }}>
            {nas.currentFolder?.folders?.map((f, i) => (
              <ListItem
                key={`folder-${i}`}
                button
                onClick={async () => {
                  setLoadingFolder(true);
                  await nas.getContent(f.id);
                  update();
                  setTimeout(() => {
                    setLoadingFolder(false);
                  }, 500);
                }}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary={f.name} />
              </ListItem>
            ))}
          </List>
        </Collapse>
        <Divider />
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title="New Folder">
          <IconButton>
            <CreateNewFolderIcon />
          </IconButton>
        </Tooltip>
        <Button
          loading={loading}
          color="blue"
          style={{ marginLeft: "auto" }}
          size="tiny"
          onClick={async () => {
            if (currentFile && nas.currentFolder) {
              try {
                setLoading(true);
                await onMove(currentFile, nas.currentFolder);
                setTimeout(() => {
                  setLoading(false);
                  update();
                  onClose();
                  nas.currentFolder = undefined;
                }, 400);
              } catch (err) {
                alert("Cannot move to this location");
                setLoading(false);
              }
            }
          }}
        >
          Move Here
        </Button>
      </CardActions>
    </Card>
  );
}
