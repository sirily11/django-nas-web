/** @format */

import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { BaseFilePlugin } from "../../models/Plugins/file plugins/BaseFilePlugin";
import { FileContentManager } from "../../models/FileContentManager";
import { File as NasFile } from "../../models/interfaces/Folder";
import { Skeleton } from "@material-ui/lab";
import {
  Backdrop,
  Box,
  CircularProgress,
  Collapse,
  Fade,
  Grid,
  Icon,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { LinearProgress, createMuiTheme } from "@material-ui/core";
import { select } from "@lingui/macro";
import { makeStyles } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";

interface Props {
  pluginsMapping: { [key: string]: BaseFilePlugin };
}

interface Params {
  fileId?: string;
  pluginName?: string;
}

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#42c8f5",
    background: "wheat",
  },
}));

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export default function PluginPage(props: Props) {
  const { pluginsMapping } = props;
  const { pluginName, fileId } = useParams<Params>();
  const [selectedPlugin, setSelectedPlugin] = React.useState<BaseFilePlugin>();
  const [downloadProgress, setDownloadProgress] = React.useState<number>();
  const [file, setFile] = React.useState<NasFile>();
  const classes = useStyles();

  React.useEffect(() => {
    try {
      let plugin = pluginsMapping[pluginName!];

      if (plugin) {
        window.document.title = plugin.getPluginName();
        const fetch = async () => {
          await sleep(500);
          setSelectedPlugin(plugin);
          await sleep(500);
          if (plugin.shouldGetFileContent()) {
            FileContentManager.getContentById(fileId!, (e) => {
              setDownloadProgress(e);
            })
              .then(async (file) => {
                setFile(file);
                setDownloadProgress(undefined);
              })
              .catch((err) => {
                setDownloadProgress(undefined);
                window.alert("Cannot fetch file with this id\n" + err);
                // window.close();
              });
          } else {
            FileContentManager.getFile(fileId!)
              .then((file) => {
                setFile(file);
              })
              .catch((err) => {
                window.alert("Cannot fetch file with this id\n" + err);
                window.close();
              });
          }
        };

        fetch();
      } else {
        window.alert("Cannot find this plugin");
      }
    } catch (err) {
      window.alert("Cannot find plugin with this name");
      window.close();
    }
  }, [pluginName, fileId]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: "100vh", display: "flex" }}>
        {selectedPlugin &&
          file &&
          selectedPlugin.render({ file: file!, onClose: () => {} })}

        <Backdrop className={classes.backdrop} open={file === undefined}>
          <Box>
            <Fade in={selectedPlugin !== undefined}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {selectedPlugin?.getIcon(100)}
              </div>
            </Fade>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <CircularProgress
                variant="indeterminate"
                color="secondary"
                style={{ margin: 10 }}
              />
              {selectedPlugin ? (
                <Typography variant="h5">
                  {selectedPlugin.getPluginName()}
                  Loading File...
                </Typography>
              ) : (
                <Typography variant="h5"> Loading Plugin...</Typography>
              )}
            </div>
            <div>
              {selectedPlugin !== undefined && (
                <LinearProgress
                  value={downloadProgress ?? 1 * 100}
                  color="secondary"
                  variant="determinate"
                />
              )}
            </div>
          </Box>
        </Backdrop>
      </div>
    </ThemeProvider>
  );
}
