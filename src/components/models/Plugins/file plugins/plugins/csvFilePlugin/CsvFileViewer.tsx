/** @format */

import React from "react";
import Axios from "axios";
import PO from "pofile";
import {
  LinearProgress,
  Grid,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Collapse,
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  Tooltip,
  Card,
  Button,
  Menu,
  Container,
  ThemeProvider,
  CssBaseline,
  MenuItem,
} from "@material-ui/core";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import { HomePageContext } from "../../../../HomeContext";
import { FileContentManager } from "../../../../FileContentManager";
import { File as NasFile } from "../../../../interfaces/Folder";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import MenuBar from "../../views/MenuBar";
import { createMuiTheme } from "@material-ui/core";
import { fileURL } from "../../../../urls";
import { Divider } from "semantic-ui-react";

interface Item {
  msgid: string;
  msgctxt?: string;
  references: string[];
  msgid_plural?: string;
  msgstr: string[];
  comments: string[];
  extractedComments: string[];
  flags: Record<string, boolean | undefined>;
  nplurals: number;
  obsolete: boolean;

  toString(): string;
}

function getPercentage(items: Item[]) {
  let translated = items.filter((i) => i.msgstr !== undefined);
  return translated.length / items.length;
}

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
export default function CsvFileViewer(props: {
  file: NasFile;
  onClose(): void;
}) {
  const classes = useStyles();
  const [content, setContent] = React.useState<Item[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { file, onClose } = props;
  const { nas, update } = React.useContext(HomePageContext);
  const [editEl, setfileEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    try {
      let parsedContent = PO.parse(file.file_content!);
      //@ts-ignore
      setContent(parsedContent.items);
    } catch (err) {}
  }, []);

  // const updateFileContentAPI = AwesomeDebouncePromise(updateFileContent, 500);

  const tag = (
    <Tooltip title="Current language">
      <Card elevation={0} className={classes.tag}>
        <Typography variant="button" style={{ fontWeight: "normal" }}>
          csv
        </Typography>
      </Card>
    </Tooltip>
  );

  const buttons = [
    <Button
      className={classes.button}
      size="small"
      onClick={(e) => setfileEl(e.currentTarget)}
    >
      Edit
    </Button>,
  ];

  const menus = [
    <Menu
      style={{ marginLeft: 20 }}
      anchorEl={editEl}
      keepMounted
      open={Boolean(editEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      onClose={() => {
        setfileEl(null);
      }}
    >
      <MenuItem>Insert Column left</MenuItem>
      <MenuItem>Insert Column right</MenuItem>
      <Divider />
      <MenuItem>Insert Row above</MenuItem>
      <MenuItem>Insert Row below</MenuItem>
    </Menu>,
  ];

  if (content === undefined) {
    return <Backdrop open={true}></Backdrop>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ height: "100%", overflow: "hidden", width: "100%" }}>
        <MenuBar
          file={file}
          isLoading={isLoading}
          tag={tag}
          onClose={onClose}
          onUpdateFileName={async (fileName) => {
            try {
              setIsLoading(true);
              let url = `${fileURL}${file.id}/`;
              await Axios.patch(url, { filename: fileName });
            } catch (err) {
              window.alert("Cannot rename");
            } finally {
              setIsLoading(false);
            }
          }}
          menus={menus}
          buttons={buttons}
        />
        <Container
          style={{
            height: "85vh",

            width: "100%",
            marginTop: 100,
          }}
        >
          
        </Container>
      </div>
    </ThemeProvider>
  );
}
