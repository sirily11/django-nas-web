/** @format */
import ReactJson from "react-json-view";

import React from "react";
import Axios from "axios";
import { LinearProgress } from "@material-ui/core";

export default function JSONViewer(props: { src: string }) {
  const [content, setContent] = React.useState<any>();

  const { src } = props;

  React.useEffect(() => {
    Axios.get(src).then((res) => {
      setContent(res.data);
    });
  }, []);

  if (content === undefined) {
    return <LinearProgress color="secondary" />;
  }

  return <ReactJson src={content} />;
}
