/** @format */

import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import sanitizeHtml from "sanitize-html";
import { BaseCell, JupyterCell } from "../BaseCell";
import { v4 } from "uuid";
import {
  Box,
  Button,
  Card,
  Collapse,
  Grid,
  Typography,
} from "@material-ui/core";

enum OutputTypes {
  stream = "stream",
  display_data = "display_data",
  execute_result = "execute_result",
}

type data = {
  [key: string]: any;
};

// interface PlainTextData {
//   "text/plain": string[];
//   [key: string]: any;
// }

// interface HTMLTextData {
//   "text/html": string[];

// }

interface Output {
  output_type: OutputTypes;
  data: data;
  text?: string[];
}

interface CodeJupyterCell extends JupyterCell {
  execution_count: number;
  outputs: Output[];
}

export class CodeCell extends BaseCell {
  state = {
    open: false,
  };

  cellType(type: string): boolean {
    return type === "code";
  }

  renderHTML(html: string[]): JSX.Element {
    let content = html.reduce((prev, curr) => prev + curr);
    let pure_content = sanitizeHtml(content);
    return (
      <div dangerouslySetInnerHTML={{ __html: pure_content }} key={v4()}></div>
    );
  }

  renderImage(type: string, data: string): JSX.Element {
    let imgSrc = `data:${type};base64,${data}`;

    return <img src={imgSrc} key={v4()} />;
  }

  renderCode(content: string[], execution_count: number): JSX.Element {
    let data = content.reduce((prev, curr) => prev + curr);
    return (
      <Grid container spacing={1}>
        <Grid xs={1} item>
          <Typography>[{execution_count ?? "    "}]</Typography>
        </Grid>
        <Grid xs={11} item>
          <SyntaxHighlighter language="python" style={vscDarkPlus} key={v4()}>
            {data}
          </SyntaxHighlighter>
        </Grid>
      </Grid>
    );
  }

  renderCell(cell: CodeJupyterCell): JSX.Element {
    return (
      <CodeCellComponent
        key={v4()}
        cell={cell}
        renderCode={this.renderCode}
        renderHTML={this.renderHTML}
        renderImage={this.renderImage}
      />
    );
  }
}

interface Props {
  cell: CodeJupyterCell;
  renderHTML(html: string[]): JSX.Element;
  renderImage(type: string, data: string): JSX.Element;
  renderCode(content: string[], execution_count: number): JSX.Element;
}

function CodeCellComponent(props: Props) {
  const { cell, renderHTML, renderCode, renderImage } = props;
  const [show, setShow] = React.useState(true);
  return (
    <Box my={1}>
      <Card variant="outlined" style={{ backgroundColor: "transparent" }}>
        <Collapse in={show} mountOnEnter unmountOnExit>
          <Box p={1}>
            {renderCode(cell.source, cell.execution_count)}
            {cell.outputs.length > 0 && (
              <Typography style={{ fontWeight: "bold" }}>Output:</Typography>
            )}

            {cell.outputs.map((output, index) => {
              let elements: JSX.Element[] = [];
              let texts: string[] = [];

              if (output.data === undefined || null) {
                let streamData = output.text;
                if (streamData) {
                  return (
                    <div>
                      {streamData.map((v) => (
                        <Typography key={v4()}>{v}</Typography>
                      ))}
                    </div>
                  );
                } else {
                  return <div key={v4()}></div>;
                }
              }
              Object.keys(output.data).forEach((key) => {
                if (key.includes("image")) {
                  let ele = renderImage(key, output.data[key]);
                  elements.push(ele);
                }
                let htmlData = output.data["text/html"];
                let textData = output.data["text/plain"];

                if (htmlData !== undefined) {
                  elements.push(renderHTML(htmlData));
                }

                if (textData !== undefined && htmlData === undefined) {
                  if (!texts.includes(textData)) {
                    elements.push(
                      <Typography variant="subtitle1" key={v4()}>
                        {textData}
                      </Typography>
                    );
                    texts.push(textData);
                  }
                }
              });

              return elements;
            })}
          </Box>
        </Collapse>
        <Grid container alignItems="flex-end" alignContent="space-around">
          <Grid item xs={11}></Grid>
          <Grid item xs={1}>
            <Button onClick={(e) => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
