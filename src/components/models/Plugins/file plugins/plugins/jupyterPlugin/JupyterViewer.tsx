/** @format */

import React from "react";
import Axios from "axios";
import {
  Typography,
  makeStyles,
  Backdrop,
  Tooltip,
  Card,
  Button,
  Menu,
  Container,
  ThemeProvider,
  CssBaseline,
  MenuItem,
  Box,
} from "@material-ui/core";
import { FileContentManager } from "../../../../FileContentManager";
import { File as NasFile } from "../../../../interfaces/Folder";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import MenuBar from "../../views/MenuBar";
import { createMuiTheme } from "@material-ui/core";
import { fileURL } from "../../../../urls";
import { Divider } from "semantic-ui-react";

import "handsontable/dist/handsontable.full.css";
import { DefaultPluginProps } from "../../BaseFilePlugin";
import { BaseCell } from "./render/BaseCell";
import { MarkdownCell } from "./render/cells/MarkdownCell";
import { CodeCell } from "./render/cells/CodeCell";

import "./style.css";

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

const theme = createMuiTheme({
  palette: {
    type: "dark",
    secondary: {
      main: "#424242",
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

interface Props extends DefaultPluginProps {}

const plugins: BaseCell[] = [new MarkdownCell(), new CodeCell()];

export default function JupyterViewer(props: Props) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { file, onClose, leadingIcon } = props;
  const [editEl, setFileEl] = React.useState<null | HTMLElement>(null);
  const [data, setData] = React.useState<any>();
  const [hideIndexs, setHideIndexs] = React.useState<number[]>([]);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.querySelector("html")!.style.overflow = "hidden";
    if (file.file_content) {
      try {
        // eslint-disable-next-line no-debugger

        const ipynb = JSON.parse(file.file_content);
        setData(ipynb);
      } catch (err) {
        window.alert("Cannot parse data." + err);
      }
    }
  }, []);

  // const updateFileContentAPI = AwesomeDebouncePromise(updateFileContent, 500);

  const tag = (
    <Tooltip title="Jupyter Notebook">
      <Card elevation={0} className={classes.tag}>
        <Typography variant="button" style={{ fontWeight: "normal" }}>
          ipynb
        </Typography>
      </Card>
    </Tooltip>
  );

  const buttons = [
    <Button
      className={classes.button}
      size="small"
      onClick={(e) => setFileEl(e.currentTarget)}
      key="file"
    >
      File
    </Button>,
  ];

  const menus = [
    <Menu
      key="File-menu"
      style={{ marginLeft: 20 }}
      anchorEl={editEl}
      keepMounted
      open={Boolean(editEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      onClose={() => {
        setFileEl(null);
      }}
    >
      <MenuItem>Help</MenuItem>
    </Menu>,
  ];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          height: "100%",
          overflow: "hidden",
          width: "100%",
          maxHeight: "100vh",
        }}
      >
        <MenuBar
          leadingIcon={leadingIcon}
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

        <div
          style={{
            height: "100%",
            overflow: "auto",
            marginTop: 90,
            paddingBottom: 120,
          }}
        >
          <Container style={{ height: "100%" }}>
            <div></div>
            {data &&
              (data.cells as any[]).map((cell, i) => {
                for (let plugin of plugins) {
                  if (plugin.cellType(cell.cell_type)) {
                    return plugin.renderCell(cell);
                  }
                }
              })}
          </Container>
        </div>
      </div>
    </ThemeProvider>
  );
}
