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
    color: "#fff",
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
      FileContentManager.getContentById(fileId)
        .then(async (file) => {
          setTimeout(() => {
            setFile(file);
            setSelectedPlugin(plugin);
          }, 500);

          window.document.title = plugin.getPluginName();
        })
        .catch((err) => {
          window.alert("Cannot fetch file with this id");
          window.close();
        });
    } catch (err) {
      window.alert("Cannot find plugin with this name");
      window.close();
    }
  }, [pluginName, fileId]);

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {selectedPlugin &&
        selectedPlugin.render({ file: file!, onClose: () => {} })}

      <Backdrop
        className={classes.backdrop}
        open={selectedPlugin === undefined}
      >
        <CircularProgress
          variant="indeterminate"
          color="secondary"
          style={{ margin: 10 }}
        />
        <Typography variant="h5"> Loading Plugin...</Typography>
      </Backdrop>
    </div>
  );
}
