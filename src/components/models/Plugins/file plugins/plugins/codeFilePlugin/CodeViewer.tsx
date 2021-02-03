/** @format */

import React from "react";
import Editor from "@monaco-editor/react";
import { File as NasFile } from "../../../../interfaces/Folder";
import {
  AppBar,
  createMuiTheme,
  makeStyles,
  Toolbar,
  Tooltip,
  Grid,
  Container,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Card,
  Typography,
} from "@material-ui/core";
import { ThemeProvider, IconButton } from "@material-ui/core";
import AutosizeInput from "react-input-autosize";
import * as path from "path";
import DoneIcon from "@material-ui/icons/Done";
import { fileURL } from "../../../../urls";
import Axios from "axios";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { FileContentManager } from "../../../../FileContentManager";
import { Button } from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";
import { languages } from "./languages";
import { NavLink } from "react-router-dom";
import DescriptionIcon from "@material-ui/icons/Description";
import MenuBar from "../../views/MenuBar";
import { DefaultPluginProps } from "../../BaseFilePlugin";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#ffffff",
    },
    primary: {
      main: "#00b2ff",
    },
  },
});

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
    background: "transparent",
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

interface Props extends DefaultPluginProps {
  codeMapping: { [key: string]: string };
}

export default function CodeViewer(props: Props) {
  const classes = useStyles();
  const [fileEl, setfileEl] = React.useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [language, setLanguage] = React.useState("text");
  const { file, codeMapping, onClose, leadingIcon } = props;

  React.useEffect(() => {
    const lang = codeMapping[path.extname(file.filename)] ?? "text";
    setLanguage(lang);
  }, [file]);

  const updateFileName = async (fileName: string) => {
    try {
      setIsLoading(true);
      let url = `${fileURL}${file.id}/`;
      await Axios.patch(url, { filename: fileName });
    } catch (err) {
      window.alert("Cannot rename");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFileContent = async (content: string) => {
    setIsLoading(true);
    try {
      await FileContentManager.updateFileContent(file.id, content);
    } catch (err) {
      window.alert(`Cannot save file: ${err}`);
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  const updateFileContentAPI = AwesomeDebouncePromise(updateFileContent, 500);

  const tag = (
    <Tooltip title="Current language">
      <Card elevation={0} className={classes.tag}>
        <Typography variant="button" style={{ fontWeight: "normal" }}>
          {language}
        </Typography>
      </Card>
    </Tooltip>
  );

  const buttons = [
    <Button
      key={"Languages"}
      className={classes.button}
      size="small"
      onClick={(e) => setfileEl(e.currentTarget)}
    >
      Languages
    </Button>,
  ];

  const menus = [
    <Menu
      key="menus"
      style={{ marginLeft: 20 }}
      anchorEl={fileEl}
      keepMounted
      open={Boolean(fileEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      onClose={() => {
        setfileEl(null);
      }}
    >
      {languages.map((l, i) => (
        <MenuItem
          key={l}
          className={classes.menuItem}
          onClick={async () => {
            setfileEl(null);
            setLanguage(l);
          }}
        >
          {l} {l === language && <DoneIcon />}
        </MenuItem>
      ))}
    </Menu>,
  ];

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: "100%" }}>
        <MenuBar
          leadingIcon={leadingIcon}
          file={file}
          menus={menus}
          buttons={buttons}
          onClose={onClose}
          tag={tag}
          isLoading={isLoading}
          onUpdateFileName={async (fileName) => {
            await updateFileName(fileName);
          }}
        />
        <Container className={classes.container}>
          <Editor
            height="85vh"
            language={language}
            defaultValue={file.file_content}
            onChange={async (newValue, e) => {
              await updateFileContentAPI(newValue ?? "");
            }}
          />
        </Container>
      </div>
    </ThemeProvider>
  );
}
