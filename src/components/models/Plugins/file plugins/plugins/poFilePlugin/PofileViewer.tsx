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
export default function PoFileViewer(props: {
  file: NasFile;
  onClose(): void;
  leadingIcon: JSX.Element;
}) {
  const classes = useStyles();
  const [content, setContent] = React.useState<Item[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { file, onClose, leadingIcon } = props;
  const { nas, update } = React.useContext(HomePageContext);
  const [fileEl, setfileEl] = React.useState<null | HTMLElement>(null);

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
          poFile
        </Typography>
      </Card>
    </Tooltip>
  );

  const buttons: JSX.Element[] = [];

  const menus: JSX.Element[] = [];

  if (content === undefined) {
    return <Backdrop open={true}></Backdrop>;
  }

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
        <Container
          style={{
            height: "85vh",

            width: "100%",
            marginTop: 100,
          }}
        >
          <Grid style={{ height: "100%", overflow: "hidden", width: "100%" }}>
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress
                  variant="determinate"
                  value={getPercentage(content)}
                  color="primary"
                />
              </Box>
              <Box minWidth={35}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >{`${Math.round(getPercentage(content))}%`}</Typography>
              </Box>
            </Box>

            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  itemCount={content.length}
                  width={width}
                  itemSize={(index) =>
                    (content[index].msgid.length / 200 + 1) * 30 + 90
                  }
                >
                  {({ style, index }) => (
                    <PoLine
                      key={`item-${index}`}
                      index={index}
                      style={style}
                      item={content[index]}
                      update={async (c, index) => {
                        setIsLoading(true);
                        content[index].msgstr = [c];
                        setContent(content);
                        content.forEach((i) => (i.flags.fuzzy = false));
                        /// new str
                        let str = content.reduce<string>(
                          (prev, curr) => prev + curr.toString() + "\n\n",
                          ""
                        );
                        try {
                          await FileContentManager.updateFileContent(
                            file.id,
                            str
                          );
                        } catch (err) {
                          alert("Saving error " + err);
                        }
                        update();
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 300);
                      }}
                    />
                  )}
                </List>
              )}
            </AutoSizer>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}

function PoLine(props: {
  item: Item;
  index: any;
  style: any;
  update(newContent: string, index: number): void;
}) {
  const { item, style, update, index } = props;
  const [value, setValue] = React.useState<string>(item.msgstr[0] ?? "");

  return (
    <Grid container style={{ ...style }} spacing={3} key={item.msgid}>
      <Grid item xs={12}>
        <Typography variant="body1" style={{ color: "grey" }}>
          {item.comments}
        </Typography>
        <Typography variant="body1" style={{ color: "grey" }}>
          {item.references}
        </Typography>
        <Typography variant="body1">{item.msgid}</Typography>
        <TextField
          label="Translation"
          variant="filled"
          fullWidth
          color="secondary"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            update(value, index);
          }}
        />
      </Grid>
    </Grid>
  );
}
