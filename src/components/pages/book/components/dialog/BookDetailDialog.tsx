import React from "react";
import {
  BookCollection,
  Document as NasDocument,
  Folder
} from "../../../../models/interfaces/Folder";
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
  fade
} from "@material-ui/core";
import BookIcon from "@material-ui/icons/Book";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { DialogTitle, Toolbar } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import FlipToFrontIcon from "@material-ui/icons/FlipToFront";
import AddIcon from "@material-ui/icons/Add";
import { BookContext } from "../../../../models/BookContext";
import MoveBookDialog from "./MoveBookDialog";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import { Container } from "semantic-ui-react";
import UpdateCollectionDialog from "./UpdateCollectionDialog";
import DeleteIcon from "@material-ui/icons/Delete";

interface Props {
  book: BookCollection;
  open: boolean;
  onClose(): void;
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

export default function BookDetailDialog(props: Props) {
  const { book, open, onClose } = props;
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
    <Dialog open={open} fullScreen>
      <Toolbar>
        <IconButton
          edge="start"
          onClick={() => {
            onClose();
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="div" className={classes.title}>
          {book.name}
        </Typography>
        <Tooltip title="Edit Document">
          <IconButton
            edge="end"
            onClick={async () => {
              if (currentBook) {
                setShowEditDialog(true);
              }
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Document">
          <IconButton
            edge="end"
            onClick={async () => {
              let confirm = window.confirm("Do you want to delete this book?");
              if (confirm) {
                onClose();
                await deleteBook(book);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Document">
          <IconButton
            edge="end"
            onClick={async () => {
              if (currentBook) {
                setIsLoading(true);
                await createDocument("unnamed document", currentBook);
                setTimeout(() => {
                  setIsLoading(false);
                }, 300);
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <DialogContent>
        <Container>
          <Collapse mountOnEnter unmountOnExit in={isLoading}>
            <LinearProgress />
          </Collapse>
          <Typography variant="subtitle1">
            {currentBook?.description}
          </Typography>
          <List>
            {book.documents?.map((d, i) => (
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
                <ListItemText primary={d.name} />
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
          </List>
        </Container>
      </DialogContent>

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
    </Dialog>
  );
}
