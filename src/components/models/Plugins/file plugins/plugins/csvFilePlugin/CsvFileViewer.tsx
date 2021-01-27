/** @format */

import React from "react";
import Axios from "axios";
import PO from "pofile";
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
import Papa from "papaparse";
import DoneIcon from "@material-ui/icons/Done";
import { HotTable } from "@handsontable/react";
import AutoSizer from "react-virtualized-auto-sizer";
import "handsontable/dist/handsontable.full.css";

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
  leadingIcon: JSX.Element;
}) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { file, onClose, leadingIcon } = props;
  const [editEl, setEditEl] = React.useState<null | HTMLElement>(null);
  const [settingsEl, setSettingsEl] = React.useState<null | HTMLElement>(null);
  const [data, setData] = React.useState<any[]>([[]]);

  const [seperator, setSeperator] = React.useState(",");
  const [firstRowHeader, setFirstRowHeader] = React.useState(true);
  const [firstColumnHeader, setFirstColumnHeader] = React.useState(false);

  const editor = React.createRef<HotTable>();

  React.useEffect(() => {
    if (file.file_content) {
      try {
        let parsed = Papa.parse(file.file_content);
        setData(parsed.data as any);
      } catch (err) {
        window.alert("Cannot parse data." + err);
      }
    }
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
      onClick={(e) => setEditEl(e.currentTarget)}
      key="edit"
    >
      Edit
    </Button>,
    <Button
      className={classes.button}
      size="small"
      onClick={(e) => setSettingsEl(e.currentTarget)}
      key="settings"
    >
      Settings
    </Button>,
  ];

  const menus = [
    <Menu
      key="Edit-menu"
      style={{ marginLeft: 20 }}
      anchorEl={editEl}
      keepMounted
      open={Boolean(editEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      onClose={() => {
        setEditEl(null);
      }}
    >
      <MenuItem>Insert Column left</MenuItem>
      <MenuItem>Insert Column right</MenuItem>
      <Divider />
      <MenuItem>Insert Row above</MenuItem>
      <MenuItem>Insert Row below</MenuItem>
    </Menu>,
    <Menu
      key="ESettings-menu"
      style={{ marginLeft: 20 }}
      anchorEl={settingsEl}
      keepMounted
      open={Boolean(settingsEl)}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      onClose={() => {
        setSettingsEl(null);
      }}
    >
      <MenuItem onClick={() => setFirstRowHeader((value) => !value)}>
        First row is header {firstRowHeader && <DoneIcon color="primary" />}
      </MenuItem>
      {/* <MenuItem onClick={() => setFirstColumnHeader((value) => !value)}>
        First column is header{" "}
        {firstColumnHeader && <DoneIcon color="primary" />}
      </MenuItem> */}
      <Divider />
      <MenuItem onClick={() => setSeperator("\t")}>
        Use tab as seperator{" "}
        {"\t" === seperator && <DoneIcon color="primary" />}{" "}
      </MenuItem>
      <MenuItem onClick={() => setSeperator(",")}>
        Use comma as seperator{" "}
        {"," === seperator && <DoneIcon color="primary" />}{" "}
      </MenuItem>
    </Menu>,
  ];

  const getData = () => {
    let retData = data!;
    if (firstRowHeader) {
      if (firstColumnHeader) {
        retData = [retData[0].map((d: any) => ""), ...retData.slice(1)];
      } else {
        retData = retData.slice(1);
      }
    }
    if (firstColumnHeader) {
      retData = retData.map((d) => d.slice(1));
    }
    return retData;
  };

  const updateData = async (plugin: any) => {
    setIsLoading(true);
    try {
      let data = plugin.exportAsString("csv", {
        columnHeaders: firstRowHeader,
        rowHeaders: firstColumnHeader,
      });

      let nasFile = await FileContentManager.updateFileContent(file.id, data);
      return Papa.parse(nasFile.file_content as string).data;
    } catch (err) {
      window.alert("Cannot save csv data. " + err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ height: "100%", overflow: "hidden", width: "100%" }}>
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
        <Box
          p={1}
          style={{
            height: "85vh",

            width: "100%",
            marginTop: 100,
          }}
        >
          <AutoSizer>
            {({ height, width }) => {
              return (
                <HotTable
                  ref={editor}
                  data={getData()}
                  colHeaders={
                    firstRowHeader
                      ? (data[0] as []).map((d: string) =>
                          d.replaceAll('"', "")
                        )
                      : false
                  }
                  rowHeaders={firstColumnHeader ? data.map((d) => d[0]) : false}
                  width={width}
                  height={height}
                  contextMenu={true}
                  licenseKey="non-commercial-and-evaluation"
                  afterChange={async (change, source) => {
                    console.log(change, source);
                    let instance = editor.current?.hotInstance;
                    if (instance && source !== "loadData") {
                      let plugin = instance.getPlugin("exportFile");
                      if (plugin) {
                        let data = await updateData(plugin);
                        if (data) {
                          setData(data);
                        }
                      }
                    }
                  }}
                />
              );
            }}
          </AutoSizer>
        </Box>
      </div>
    </ThemeProvider>
  );
}
