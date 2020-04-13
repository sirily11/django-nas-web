import React, { useState, useContext } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  IconButton,
  CircularProgress,
  fade,
  InputBase
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

import SearchIcon from "@material-ui/icons/Search";
import { MusicContext } from "../../../models/MusicContext";
import {
  Folder,
  Document as NasDocument,
  File as NasFile
} from "../../../models/Folder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popper: {
      marginTop: 10,
      marginRight: 15,
      width: "40ch",
      maxHeight: 400,
      overflow: "auto"
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto"
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch"
        }
      }
    }
  })
);

export default function MusicSearchField() {
  const classes = useStyles();
  const { search } = useContext(MusicContext);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <SearchIcon />
        )}
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        value={value}
        inputProps={{ "aria-label": "search" }}
        onChange={async e => {
          let keyword = e.target.value;
          setValue(keyword);
        }}
        onKeyDown={async e => {
          if (e.key === "Enter") {
            setIsLoading(true);
            search(value);
            setIsLoading(false);
          }
        }}
      />
      <IconButton
        disabled={value === ""}
        onClick={async () => {
          setIsLoading(true);
          setValue("");
          await search("");
          setIsLoading(false);
        }}
      >
        <ClearIcon />
      </IconButton>
    </div>
  );
}
