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
} from "@material-ui/core";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import { HomePageContext } from "../../../../HomeContext";
import { FileContentManager } from "../../../../FileContentManager";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

export default function PoFileViewer(props: {
  src: string;
  filename: string;
  fileID: any;
}) {
  const classes = useStyles();
  const [content, setContent] = React.useState<Item[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { src, filename, fileID } = props;
  const { nas, update } = React.useContext(HomePageContext);

  React.useEffect(() => {
    FileContentManager.getContent(src)
      .then((content) => {
        let parsedContent = PO.parse(content);
        //@ts-ignore
        setContent(parsedContent.items);
      })
      .catch((err) => alert("Error: " + err));
  }, []);

  if (content === undefined) {
    return <Backdrop className={classes.backdrop} open={true}></Backdrop>;
  }

  return (
    <Grid style={{ height: "100%", overflow: "hidden" }}>
      <Collapse in={isLoading}>
        <LinearProgress color="secondary" />
      </Collapse>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress
            variant="determinate"
            value={getPercentage(content)}
            color="secondary"
          />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            getPercentage(content)
          )}%`}</Typography>
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
                    await FileContentManager.updateFileContent(fileID, str);
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
