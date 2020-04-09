import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
interface Props {
  file: string;
}

export default function PDFViewer(props: Props) {
  const [pageNumber, setpageNumber] = useState(1);
  const [current, setcurrent] = useState(1);

  return (
    <Document
      file={props.file}
      onLoadSuccess={pdf => {
        setpageNumber(pdf.numPages);
      }}
    >
      {Array.from(new Array(pageNumber), (el, index) => (
        <Page key={`page-${index}`} pageNumber={index + 1} />
      ))}
    </Document>
  );
}
