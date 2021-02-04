/** @format */

import React, { Component } from "react";
import { Nas } from "./interfaces/nas";
import { RouteComponentProps } from "react-router";
import {
  Folder,
  Document as NasDocument,
  File as NasFile,
} from "./interfaces/Folder";
import { UploadInfo } from "../pages/home/components/files/dialog/UploadDialog";
import * as path from "path";
//@ts-ignore
import { MarkdownToQuill } from "md-to-quill-delta";
const QuillDeltaToHtmlConverter = require("quill-delta-to-html")
  .QuillDeltaToHtmlConverter;

interface RouterProps {
  id: string;
}

interface DocumentContext {
  nas: Nas;
  isLoading: boolean;
  errorMsg?: string;
  currentDocument?: NasDocument;
  update(): void;
  updateDocument(doc: NasDocument): void;
  saveDocument(): Promise<void>;
  saveToLocal(savingType: "html" | "pdf"): Promise<void>;
  oepnFromLocal(): Promise<void>;
  newDocument(name: string): Promise<void>;
}

interface DocumentProps extends RouteComponentProps<RouterProps> {}

export class DocumentProvider extends Component<
  DocumentProps,
  DocumentContext
> {
  constructor(props: DocumentProps) {
    super(props);
    this.state = {
      nas: new Nas(),
      isLoading: false,
      update: this.update,
      updateDocument: this.update,
      saveDocument: this.saveDocument,
      saveToLocal: this.saveToLocal,
      oepnFromLocal: this.openFromLocal,
      newDocument: this.newDocument,
    };
  }

  async componentDidUpdate(oldProps: DocumentProps) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      let id = this.props.match.params.id;
      if (id) {
        await this.fetch(id);
      }
    }
  }

  updateDocument = (doc: NasDocument) => {
    this.setState({ currentDocument: doc });
  };

  saveDocument = async () => {
    try {
      let doc = this.state.currentDocument;
      if (doc) {
        this.setState({ isLoading: true });
        await this.state.nas.updateDocument(doc.id, doc.name, doc.content);
      }
    } catch (err) {
      this.setState({ errorMsg: "Failed to save" });
    } finally {
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 1000);

      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      }, 3000);
    }
  };

  newDocument = async (name: string) => {};

  readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (content) => {
        let text = reader.result;

        resolve(text as string);
      };
      reader.readAsText(file);
    });
  };

  openFromLocal = async () => {
    const { currentDocument, nas } = this.state;
    try {
      let input =
        (document.getElementById("new file") as HTMLInputElement) ??
        document.createElement("input");
      input.id = "new file";
      input.type = "file";
      input.accept = ".md,.html";
      input.multiple = false;
      input.click();
      input.addEventListener("change", async (e) => {
        this.setState({
          isLoading: true,
          errorMsg: "Reading Local Document...",
        });
        let files = input.files;
        if (files) {
          let file = files[0];
          let ext = path.extname(file.name);
          if (ext === ".md") {
            const converter = new MarkdownToQuill();
            let content = await this.readFile(file);
            let delta = converter.convert(content);
            this.setState({ errorMsg: "Creating New Document" });
            let d = await nas.createNewDocument(
              file.name,
              { ops: delta } as any,
              currentDocument?.parent
            );
            this.setState({
              errorMsg: "Document Created. Preparing for redirecting",
            });
            setTimeout(() => {
              this.setState({ isLoading: false, errorMsg: undefined });
              window.location.href = "#/document/" + d.id;
            }, 1500);
          }
        }
        input.remove();
      });
    } catch (err) {
      this.setState({ errorMsg: "Unable to open file", isLoading: false });
    }
  };

  saveToLocal = async (savingType: "html" | "pdf") => {
    let doc = this.state.currentDocument;
    if (doc) {
      switch (savingType) {
        case "html": {
          let converter = new QuillDeltaToHtmlConverter(doc.content);
          let html = converter.convert();
          break;
        }
      }
    }
  };

  async UNSAFE_componentWillMount() {
    let id = this.props.match.params.id;
    if (id) {
      await this.fetch(id);
    }
  }

  fetch = async (id: string) => {
    try {
      this.setState({ isLoading: true });
      let document = await this.state.nas.getDocument(id);
      setTimeout(() => {
        this.setState({ currentDocument: document });
      }, 400);
    } catch (err) {
      this.setState({ errorMsg: "Failed to open" });
    } finally {
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 500);
      this.setState({ currentDocument: undefined });
      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      }, 3000);
    }
  };

  update = () => {
    this.setState({
      nas: this.state.nas,
    });
  };

  render() {
    return (
      <DocumentContext.Provider value={this.state}>
        {this.props.children}
      </DocumentContext.Provider>
    );
  }
}

//@ts-ignore
const context: DocumentContext = {
  nas: new Nas(),
  update: () => {},
  updateDocument: (d: NasDocument) => {},
  saveDocument: () => {
    return Promise.resolve();
  },
  oepnFromLocal: () => {
    return Promise.resolve();
  },
  newDocument: () => {
    return Promise.resolve();
  },
  saveToLocal: () => {
    return Promise.resolve();
  },
  isLoading: false,
};

export const DocumentContext = React.createContext(context);
