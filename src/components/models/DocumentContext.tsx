import React, { Component } from "react";
import { Nas } from "./nas";
import { RouteComponentProps } from "react-router";
import { Folder, Document as NasDocument, File as NasFile } from "./Folder";
import { UploadInfo } from "../pages/home/components/files/UploadDialog";

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
      saveDocument: this.saveDocument
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
    this.setState({ isLoading: true });
    let doc = this.state.currentDocument;
    if (doc) {
      await this.state.nas.updateDocument(doc.id, doc.name, doc.content);
    }
    this.setState({ isLoading: false });
  };

  async componentWillMount() {
    let id = this.props.match.params.id;
    if (id) {
      await this.fetch(id);
    }
  }

  fetch = async (id: string) => {
    this.setState({ isLoading: true });
    let document = await this.state.nas.getDocument(id);
    setTimeout(() => {
      this.setState({ currentDocument: document, isLoading: false });
    }, 400);
  };

  update = () => {
    this.setState({
      nas: this.state.nas
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

const context: DocumentContext = {
  nas: new Nas(),
  update: () => {},
  updateDocument: (d: NasDocument) => {},
  saveDocument: () => {
    return Promise.resolve();
  },
  isLoading: false
};

export const DocumentContext = React.createContext(context);
