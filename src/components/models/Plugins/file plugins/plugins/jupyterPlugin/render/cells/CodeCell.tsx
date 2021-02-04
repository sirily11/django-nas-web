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

  renderHTML(id: string, html: string[]): JSX.Element {
    let content = html.reduce((prev, curr) => prev + curr);
    let pure_content = sanitizeHtml(content);
    return (
      <div dangerouslySetInnerHTML={{ __html: pure_content }} key={id}></div>
    );
  }

  renderImage(id: string, type: string, data: string): JSX.Element {
    let imgSrc = `data:${type};base64,${data}`;

    return <img src={imgSrc} key={id} />;
  }

  renderCode(
    id: string,
    content: string[],
    execution_count: number
  ): JSX.Element {
    let data = content.reduce((prev, curr) => prev + curr);
    return (
      <Grid container spacing={1}>
        <Grid xs={1} item>
          <Typography>[{execution_count ?? "    "}]</Typography>
        </Grid>
        <Grid xs={11} item>
          <SyntaxHighlighter language="python" style={vscDarkPlus} key={id}>
            {data}
          </SyntaxHighlighter>
        </Grid>
      </Grid>
    );
  }

  renderCell(cell: CodeJupyterCell): JSX.Element {
    return (
      <CodeCellComponent
        key={cell.metadata.id}
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
  renderHTML(id: string, html: string[]): JSX.Element;
  renderImage(id: string, type: string, data: string): JSX.Element;
  renderCode(
    id: string,
    content: string[],
    execution_count: number
  ): JSX.Element;
}

function CodeCellComponent(props: Props) {
  const { cell, renderHTML, renderCode, renderImage } = props;
  const [show, setShow] = React.useState(true);
  return (
    <Box my={1} key={`code-${cell.metadata.id}`}>
      <Card variant="outlined" style={{ backgroundColor: "transparent" }}>
        <Collapse in={show} mountOnEnter unmountOnExit>
          <Box p={1}>
            {renderCode(
              cell.metadata.id + "code",
              cell.source,
              cell.execution_count
            )}
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
                    <div key={`${cell.metadata.id}-stream-${index}`}>
                      {streamData.map((v, streamIndex) => (
                        <Typography
                          key={`${cell.metadata.id}-stream-${index}-${streamIndex}`}
                        >
                          {v}
                        </Typography>
                      ))}
                    </div>
                  );
                } else {
                  return <div key={`${cell.metadata.id}-empty-${index}`}></div>;
                }
              }
              Object.keys(output.data).forEach((key, keyIndex) => {
                if (key.includes("image")) {
                  let ele = renderImage(
                    `${cell.metadata.id}-img-${index}-${keyIndex}`,
                    key,
                    output.data[key]
                  );
                  elements.push(ele);
                }
                let htmlData = output.data["text/html"];
                let textData = output.data["text/plain"];

                if (htmlData !== undefined) {
                  elements.push(
                    renderHTML(
                      `${cell.metadata.id}-html-${index}-${keyIndex}`,
                      htmlData
                    )
                  );
                }

                if (textData !== undefined && htmlData === undefined) {
                  if (!texts.includes(textData)) {
                    elements.push(
                      <Typography
                        variant="subtitle1"
                        key={`${cell.metadata.id}-puretext-${index}-${keyIndex}`}
                      >
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
