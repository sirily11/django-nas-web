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
  LinearProgress
} from "@material-ui/core";
import { DocumentContext } from "../../../models/DocumentContext";
import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { Button } from "semantic-ui-react";

interface Props {
  onClose(): void;
}

export default function MoveDialog(props: Props) {
  const { nas, update, currentDocument, updateDocument } = useContext(
    DocumentContext
  );
  const [loading, setLoading] = useState(false);
  const [loadingFolder, setLoadingFolder] = useState(false);

  return (
    <Card style={{ width: "300px" }}>
      <CardContent>
        <div>
          {" "}
          <IconButton
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
          <LinearProgress />
        </Collapse>

        <Collapse in={!loadingFolder} mountOnEnter unmountOnExit>
          <List style={{ padding: 0 }}>
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
      </CardContent>
      <CardActions>
        <Button
          loading={loading}
          onClick={async () => {
            if (currentDocument && nas.currentFolder) {
              setLoading(true);
              console.log(nas.currentFolder);
              await nas.moveDocument(
                currentDocument.id,
                nas.currentFolder.id ?? null
              );
              currentDocument.parent = nas.currentFolder.id;
              updateDocument(currentDocument);

              setTimeout(() => {
                setLoading(false);
                update();
                props.onClose();
              }, 400);
            }
          }}
        >
          Move To This
        </Button>
      </CardActions>
    </Card>
  );
}
