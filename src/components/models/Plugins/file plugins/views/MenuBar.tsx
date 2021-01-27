/** @format */

import React from "react";
import Editor from "@monaco-editor/react";
import { File as NasFile } from "../../../interfaces/Folder";
import {
  AppBar,
  createMuiTheme,
  makeStyles,
  Toolbar,
  Tooltip,
  Grid,
  Menu,
  Card,
  Typography,
} from "@material-ui/core";
import { ThemeProvider, IconButton } from "@material-ui/core";
import AutosizeInput from "react-input-autosize";
import { Button } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";

const useStyles = makeStyles((theme) => ({
  appbar: {
    height: "90px",
  },

  container: {
    marginTop: "100px",
  },
  button: {
    padding: "4px 6px",
    minWidth: "40px",
    fontSize: "14px",
    fontWeight: "normal",
    textTransform: "capitalize",
  },
  menuItem: {
    minWidth: 150,
  },
  notchedOutline: {
    "&:focus": {},
    border: 0,
    fontWeight: "normal",
    fontSize: "18px",
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 10,
  },
  largeIcon: {
    width: 40,
    height: 40,
  },

  tag: {
    paddingLeft: 6,
    paddingRight: 6,
    backgroundColor: "#fbbc04",
  },
}));

export default function MenuBar(props: {
  file: NasFile;
  menus: JSX.Element[];
  buttons: JSX.Element[];
  isLoading: boolean;
  tag?: JSX.Element;
  leadingIcon: JSX.Element;
  onUpdateFileName(name: string): void;
  onClose(): void;
}) {
  const classes = useStyles();
  const {
    file,
    menus,
    buttons,
    isLoading,
    onUpdateFileName,
    onClose,
    tag,
    leadingIcon,
  } = props;
  const [fileName, setFileName] = React.useState(file.filename);

  React.useEffect(() => {
    window.addEventListener("beforeunload", () => {
      onClose();
    });
  }, []);

  React.useEffect(() => {
    setFileName(file.filename);
  }, [file]);

  return (
    <AppBar elevation={0} className={classes.appbar} color="secondary">
      <Toolbar>
        <IconButton
          onClick={() => {
            onClose();
            window.close();
          }}
        >
          {leadingIcon}
        </IconButton>
        <Grid style={{ marginLeft: 10 }}>
          <Grid
            style={{ padding: 0 }}
            container
            alignContent="center"
            alignItems="center"
          >
            <AutosizeInput
              id="test-input"
              className={classes.notchedOutline}
              onChange={(e) => {
                setFileName(e.target.value);
              }}
              onBlur={async () => {
                onUpdateFileName(fileName);
              }}
              style={{
                maxWidth: window.innerWidth * 0.8,
              }}
              value={fileName}
            />
            {tag && tag}
          </Grid>

          <Grid container alignItems="baseline">
            {buttons}
            <Typography
              variant="subtitle1"
              style={{
                textDecoration: "underline",
                color: "grey",
                marginLeft: buttons.length > 0 ? 20 : 0,
                fontSize: 15,
              }}
            >
              {isLoading
                ? "Commnucating with server"
                : "All changes saved in Drive"}
            </Typography>
          </Grid>
        </Grid>

        {menus}
      </Toolbar>
    </AppBar>
  );
}
