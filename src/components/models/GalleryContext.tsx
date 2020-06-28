/** @format */

import React, { Component } from "react";
import { Nas } from "./interfaces/nas";
import { RouteComponentProps } from "react-router";
import {
  Folder,
  Document as NasDocument,
  File as NasFile,
  PaginationResponse,
} from "./interfaces/Folder";
import Axios from "axios";
import * as mm from "music-metadata-browser";
import { musicURL, musicMetadataURL, galleryURL } from "./urls";
import queryString from "query-string";
import { MusicMetadata } from "./interfaces/Folder";

interface GalleryContext {
  isLoading: boolean;
  nextURL?: string | null;
  files: NasFile[];
  selectedImage?: NasFile;
  openDialog: boolean;
  fetchImages(): Promise<void>;
  fetchMore(): Promise<void>;
  refresh(): Promise<void>;
  onImageClick(image: NasFile | undefined): void;
}

interface GalleryProps {}

export class GalleryProvider extends Component<GalleryProps, GalleryContext> {
  constructor(props: GalleryProps) {
    super(props);
    this.state = {
      isLoading: false,
      files: [],
      openDialog: false,
      fetchImages: this.fetchImages,
      fetchMore: this.fetchMore,
      refresh: this.refresh,
      onImageClick: this.onImageClick,
    };
  }

  onImageClick = (image: NasFile | undefined) => {
    if (image) {
      this.setState({ openDialog: true, selectedImage: image });
    } else {
      this.setState({ openDialog: false, selectedImage: undefined });
    }
  };

  refresh = async () => {
    try {
      this.setState({ isLoading: true });
      let response = await Axios.patch(galleryURL + "2/");
    } catch (err) {
      alert("Error: " + err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchImages = async () => {
    this.setState({ isLoading: true });
    const { files } = this.state;
    try {
      let response = await Axios.get<PaginationResponse<NasFile>>(galleryURL);
      response.data.results.forEach((i) => files.push(i));
      this.setState({
        files: files,
        nextURL: response.data.next,
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchMore = async () => {
    try {
      this.setState({ isLoading: true });
      if (this.state.nextURL) {
        this.setState({ isLoading: true });
        let response = await Axios.get<PaginationResponse<NasFile>>(
          this.state.nextURL
        );

        this.setState({
          files: response.data.results,
          nextURL: response.data.next,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <GalleryContext.Provider value={this.state}>
        {this.props.children}
      </GalleryContext.Provider>
    );
  }
}

//@ts-ignore
const context: GalleryContext = {};

export const GalleryContext = React.createContext(context);
