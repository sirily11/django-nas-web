/** @format */

import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { BaseFilePlugin } from "../../models/Plugins/file plugins/BaseFilePlugin";
import { FileContentManager } from "../../models/FileContentManager";
import { File as NasFile } from "../../models/interfaces/Folder";
import { Skeleton } from "@material-ui/lab";
import {
  Backdrop,
  CircularProgress,
  Collapse,
  Fade,
  Grid,
  Typography,
} from "@material-ui/core";
import { LinearProgress } from "@material-ui/core";
import { select } from "@lingui/macro";
import { makeStyles } from "@material-ui/core";

interface Props {
  pluginsMapping: { [key: string]: BaseFilePlugin };
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "white",
  },
}));

export default function PluginPage(props: Props) {
  const { pluginsMapping } = props;
  const { pluginName, fileId } = useParams() as any;
  const [selectedPlugin, setSelectedPlugin] = React.useState<BaseFilePlugin>();
  const [file, setFile] = React.useState<NasFile>();
  const classes = useStyles();

  React.useEffect(() => {
    try {
      let plugin = pluginsMapping[pluginName];
      if (plugin) {
        window.document.title = plugin.getPluginName();
        setTimeout(() => {
          setSelectedPlugin(plugin);
          setTimeout(() => {
            if (plugin.shouldGetFileContent()) {
              FileContentManager.getContentById(fileId)
                .then(async (file) => {
                  setFile(file);
                })
                .catch((err) => {
                  window.alert("Cannot fetch file with this id");
                  window.close();
                });
            } else {
              FileContentManager.getFile(fileId)
                .then((file) => {
                  setFile(file);
                })
                .catch((err) => {
                  window.alert("Cannot fetch file with this id\n" + err);
                  window.close();
                });
            }
          }, 500);
        }, 500);
      } else {
        window.alert("Cannot find this plugin");
      }
    } catch (err) {
      window.alert("Cannot find plugin with this name");
      window.close();
    }
  }, [pluginName, fileId]);

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {selectedPlugin &&
        file &&
        selectedPlugin.render({ file: file!, onClose: () => {} })}

      <Backdrop className={classes.backdrop} open={file === undefined}>
        <CircularProgress
          variant="indeterminate"
          color="secondary"
          style={{ margin: 10 }}
        />
        {selectedPlugin ? (
          <Typography variant="h5">
            {selectedPlugin.getPluginName()} Loading File...
          </Typography>
        ) : (
          <Typography variant="h5"> Loading Plugin...</Typography>
        )}
      </Backdrop>
    </div>
  );
}
