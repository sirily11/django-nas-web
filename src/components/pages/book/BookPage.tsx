import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  CircularProgress,
  Snackbar
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { NavLink } from "react-router-dom";
import { BookContext } from "../../models/BookContext";
import Container from "@material-ui/core/Container";
import BookList from "./components/list/BookList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff"
    }
  })
);

export default function BookPage() {
  const classes = useStyles();
  const { isLoading, errorMsg } = React.useContext(BookContext);
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <NavLink to="/">
            <IconButton
              edge="start"
              style={{ color: "white" }}
              aria-label="menu"
            >
              <HomeIcon />
            </IconButton>
          </NavLink>
          <Typography variant="h6">Books</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: 10 }}>
        <BookList />
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={errorMsg !== undefined}
        message={errorMsg}
      ></Snackbar>

      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
