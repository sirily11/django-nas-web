/** @format */

import React from "react";
import Axios from "axios";
import * as path from "path";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwlLight";
import { LinearProgress } from "@material-ui/core";

export default function CodeViewer(props: { src: string }) {
  const [content, setContent] = React.useState<string>();
  const [language, setlanguage] = React.useState<any>("python");

  const { src } = props;

  React.useEffect(() => {
    Axios.get(src).then((res) => {
      const ext = path.extname(src);
      if (ext !== ".py") {
        setlanguage(ext.replace(".", ""));
      }
      setContent(res.data);
    });
  }, []);

  if (content === undefined) {
    return <LinearProgress color="secondary" />;
  }

  return (
    <Highlight
      {...defaultProps}
      code={content}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
