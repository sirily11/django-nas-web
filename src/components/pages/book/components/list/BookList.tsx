import React from "react";
import {
  Grid,
  Card,
  Typography,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { BookContext } from "../../../../models/BookContext";
import { BookCollection } from "../../../../models/interfaces/Folder";
import BookDetailDialog from "../dialog/BookDetailDialog";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import UpdateCollectionDialog from "../dialog/UpdateCollectionDialog";

export default function BookList() {
  const {
    books,
    fetchBookDetail,
    isLoading,
    currentBook,
    addNewBook,
    onCloseDetailDialog
  } = React.useContext(BookContext);

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  return (
    <Grid container spacing={3} alignItems="center" justify="center">
      {books.map((b, i) => (
        <Grid item key={`book-${i}`} xs={6} sm={4} md={2}>
          <Card
            style={{
              height: 200,
              alignContent: "center",
              alignItems: "center",
              justifyItems: "center"
            }}
          >
            <CardActionArea
              style={{ height: "100%" }}
              onClick={async () => {
                await fetchBookDetail(b.id);
              }}
            >
              <CardContent>
                <Typography align="center">{b.name}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      <Grid item xs={6} sm={4} md={2}>
        <Card
          style={{
            height: 200,
            alignContent: "center",
            alignItems: "center",
            justifyItems: "center"
          }}
        >
          <Tooltip title="Add Book">
            <CardActionArea
              style={{ height: "100%" }}
              onClick={async () => {
                setShowCreateDialog(true);
              }}
            >
              <CardContent>
                <AddCircleIcon
                  fontSize="large"
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                />
              </CardContent>
            </CardActionArea>
          </Tooltip>
        </Card>
      </Grid>
      {currentBook && (
        <BookDetailDialog
          open={currentBook !== undefined && !isLoading}
          book={currentBook}
          onClose={() => {
            onCloseDetailDialog();
          }}
        />
      )}

      {showCreateDialog && (
        <UpdateCollectionDialog
          open={showCreateDialog}
          onClose={async (name, desc) => {
            if (name && desc) {
              await addNewBook(name, desc);
            }
            setShowCreateDialog(false);
          }}
        />
      )}
    </Grid>
  );
}
