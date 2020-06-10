import React, { useState, useContext } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  CircularProgress,
  fade,
  InputBase,
  MenuList,
  Popper,
  Paper,
  ClickAwayListener,
  Typography
} from "@material-ui/core";
import { HomePageContext } from "../../../../models/HomeContext";
import moment from "moment";
import path from "path";
import {
  Folder,
  Document as NasDocument,
  File as NasFile
} from "../../../../models/interfaces/Folder";
import SearchIcon from "@material-ui/icons/Search";

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

export default function SearchField() {
  const classes = useStyles();
  const { nas, update } = useContext(HomePageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [value, setValue] = useState("");

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        inputProps={{ "aria-label": "search" }}
        onClick={e => setAnchorEl(e.currentTarget)}
        onChange={async e => {
          let keyword = e.target.value;
          setValue(keyword);
        }}
        onKeyDown={async e => {
          if (e.key === "Enter") {
            setIsLoading(true);
            await nas.search(value);
            update();
            setIsLoading(false);
          }
        }}
      />

      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper className={classes.popper}>
            {nas.searchedFiles.length === 0 && (
              <ListItem>No File. Press Enter to search</ListItem>
            )}
            {nas.searchedFiles.map(f => (
              <MenuItem
                key={f.id}
                onClick={() => {
                  window.location.href = `#/home/${f.parent}`;
                  handleClose();
                }}
              >
                <ListItemText
                  primary={
                    <Typography noWrap>{path.basename(f.filename)}</Typography>
                  }
                  secondary={<Typography>{f.created_at}</Typography>}
                />
              </MenuItem>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
