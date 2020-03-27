import React, { Component } from "react";
import { Nas } from "./nas";
import { RouteComponentProps } from "react-router";
import { Folder, Document as NasDocument, File as NasFile } from "./Folder";
import { UploadInfo } from "../pages/home/components/files/UploadDialog";

interface RouterProps {
  id: string;
}

interface HomePageContext {
  nas: Nas;
  selectedDocument?: NasDocument;
  uploadInfo?: UploadInfo;
  updateUploadInfo(info?: UploadInfo): void;
  uploadFiles?: File[];
  setUploadInfo(files?: File[]): void;
  update(): void;
  selectDocument(doc?: NasDocument): void;
  isLoading: boolean;
}

interface HomePageProps extends RouteComponentProps<RouterProps> {}

export class HomePageProvider extends Component<
  HomePageProps,
  HomePageContext
> {
  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      nas: new Nas(),
      selectDocument: this.selectDocument,
      updateUploadInfo: this.updateUploadInfo,
      setUploadInfo: this.setUploadInfo,
      update: this.update,
      isLoading: false
    };
  }

  selectDocument = (document?: NasDocument) => {
    this.setState({ selectedDocument: document });
  };

  updateUploadInfo = (uploadInfo?: UploadInfo) => {
    this.setState({ uploadInfo });
  };

  setUploadInfo = (file: File[]) => {
    this.setState({ uploadFiles: file });
  };

  async componentDidUpdate(oldProps: HomePageProps) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      let id = this.props.match.params.id;
      await this.fetch(id);
    }
  }

  async componentWillMount() {
    let id = this.props.match.params.id;
    await this.fetch(id);
  }

  fetch = async (id: any) => {
    this.setState({ isLoading: true });
    const { nas } = this.state;
    await nas.getContent(id);
    this.setState({ nas, isLoading: false });
  };

  update = () => {
    this.setState({
      nas: this.state.nas
    });
  };

  render() {
    return (
      <HomePageContext.Provider value={this.state}>
        {this.props.children}
      </HomePageContext.Provider>
    );
  }
}

const context: HomePageContext = {
  nas: new Nas(),
  update: () => {},
  selectDocument: () => {},
  updateUploadInfo: (info: UploadInfo) => {},
  setUploadInfo: (files: File[]) => {},
  isLoading: false
};

export const HomePageContext = React.createContext(context);
