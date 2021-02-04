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
import Axios from "axios";
import { updateDescriptionURL } from "./urls";

interface RouterProps {
  id: string;
}

interface HomePageContext {
  nas: Nas;
  selectedDocument?: NasDocument;
  uploadInfo?: UploadInfo;
  updateUploadInfo(info?: UploadInfo): void;
  uploadFiles?: File[];
  uploadedFiles: File[];
  setUploadInfo(files?: File[]): void;
  update(): void;
  fetch(id: any): Promise<void>;
  selectDocument(doc?: NasDocument): void;
  setUploadedFiles(files: File[]): void;
  updateDescription(): Promise<void>;
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
      uploadedFiles: [],
      fetch: this.fetch,
      setUploadedFiles: this.setUploadedFile,
      updateDescription: this.updateDescription,
      isLoading: false,
    };
  }

  updateDescription = async () => {
    try {
      this.setState({ isLoading: true });
      await Axios.get(updateDescriptionURL);
      let id = this.props.match.params.id;
      await this.fetch(id);
    } catch (err) {
      alert(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  setUploadedFile = (files: File[]) => {
    this.setState({ uploadedFiles: files });
  };

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

  async UNSAFE_componentWillMount() {
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
      nas: this.state.nas,
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

//@ts-ignore
const context: HomePageContext = {
  nas: new Nas(),
  uploadedFiles: [],
  setUploadedFiles: (files: File[]) => {},
  update: () => {},
  selectDocument: () => {},
  updateUploadInfo: (info: UploadInfo) => {},
  setUploadInfo: (files: File[]) => {},
  isLoading: false,
};

export const HomePageContext = React.createContext(context);
