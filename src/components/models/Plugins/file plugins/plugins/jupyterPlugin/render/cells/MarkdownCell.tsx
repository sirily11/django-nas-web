/** @format */

import React from "react";
import ReactMarkdown from "react-markdown";
import Tex from "@matejmazur/react-katex";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import math from "remark-math";
import { BaseCell, JupyterCell } from "../BaseCell";

import "katex/dist/katex.min.css";
import { v4 } from "uuid";
import { Typography } from "@material-ui/core";

interface MarkdownJupyterCell extends JupyterCell {}

const renderers = {
  inlineMath: ({ value }: { value: any }) => <Tex math={value} />,
  math: ({ value }: { value: any }) => <Tex block math={value} />,

  code: ({ language, value }: { value: any; language: any }) => (
    <SyntaxHighlighter style={vscDarkPlus} language={language}>
      {value}
    </SyntaxHighlighter>
  ),
};

export class MarkdownCell extends BaseCell {
  cellType(type: string): boolean {
    return type === "markdown";
  }
  renderCell(cell: MarkdownJupyterCell): JSX.Element {
    return (
      <React.Fragment key={v4()}>
        <ReactMarkdown plugins={[math as any]} renderers={renderers}>
          {cell.source.reduce((prev, curr) => prev + curr)}
        </ReactMarkdown>
      </React.Fragment>
    );
  }
}
