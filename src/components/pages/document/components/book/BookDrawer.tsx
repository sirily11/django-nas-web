import React from "react";
import {
  BookCollection,
  Document as NasDocument,
  Folder
} from "../../../../models/Folder";
import ListItem from "@material-ui/core/ListItem";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  LinearProgress,
  Collapse,
  Typography,
  Tooltip,
  AppBar,
  makeStyles,
  Theme,
  createStyles,
  fade,
  Divider
} from "@material-ui/core";
import BookIcon from "@material-ui/icons/Book";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { DialogTitle, Toolbar } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import FlipToFrontIcon from "@material-ui/icons/FlipToFront";
import AddIcon from "@material-ui/icons/Add";
import { BookContext } from "../../../../models/BookContext";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import { Container } from "semantic-ui-react";

import DeleteIcon from "@material-ui/icons/Delete";
import MoveBookDialog from "../../../book/components/dialog/MoveBookDialog";
import UpdateCollectionDialog from "../../../book/components/dialog/UpdateCollectionDialog";

interface Props {
  book: BookCollection;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },

    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    }
  })
);

export default function BookDrawer() {
  const classes = useStyles();

  const {
    deleteDocument,
    moveDocumentTo,
    createDocument,
    updateBook,
    currentBook,
    deleteBook
  } = React.useContext(BookContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentDoc, setCurrentDoc] = React.useState<NasDocument>();
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  return (
    <div style={{ width: 350 }}>
      <div style={{ marginLeft: 20, marginTop: 30, marginBottom: 30 }}>
        <Typography variant="h5">
          {currentBook?.name}
          <IconButton
            onClick={() => {
              setShowEditDialog(true);
            }}
          >
            <EditIcon />
          </IconButton>
        </Typography>
        <Divider />
        <Typography variant="subtitle2" style={{ color: "#b5b5b5" }}>
          {currentBook?.description}
        </Typography>
      </div>

      <Collapse mountOnEnter unmountOnExit in={isLoading}>
        <LinearProgress />
      </Collapse>
      <List>
        {currentBook?.documents?.map((d, i) => (
          <ListItem
            button
            key={`document-${i}`}
            onClick={() => {
              window.location.href = "#/document/" + d.id;
            }}
          >
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Tooltip title={d.name}>
                  <Typography style={{ maxWidth: 150 }} noWrap>
                    {d.name}
                  </Typography>
                </Tooltip>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={async () => {
                  let confirm = window.confirm(
                    "Do you want to delete this document?"
                  );
                  if (confirm) {
                    setIsLoading(true);
                    await deleteDocument(d.id);
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 300);
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  setCurrentDoc(d);
                }}
              >
                <FlipToFrontIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <Button
          style={{ width: "100%", padding: 20 }}
          color="primary"
          startIcon={<AddIcon />}
          onClick={async () => {
            if (currentBook) {
              await createDocument("unnamed document", currentBook);
            }
          }}
        >
          Add New Document
        </Button>
      </List>

      {currentDoc && (
        <MoveBookDialog
          open={Boolean(currentDoc)}
          onClose={async target => {
            setCurrentDoc(undefined);
            if (target) {
              await moveDocumentTo(currentDoc, target);
            }
          }}
          currentDoc={currentDoc}
        />
      )}

      {currentBook && (
        <UpdateCollectionDialog
          open={showEditDialog}
          onClose={async (name, desc) => {
            if (name && desc) {
              await updateBook(name, desc);
            }
            setShowEditDialog(false);
          }}
        />
      )}
    </div>
  );
}
