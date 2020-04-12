import React, { Component } from "react";
import { Nas } from "./nas";
import { RouteComponentProps } from "react-router";
import {
  Folder,
  Document as NasDocument,
  File as NasFile,
  PaginationResponse
} from "./Folder";
import Axios from "axios";
import * as mm from "music-metadata-browser";
import { musicURL } from "./urls";
//@ts-ignore
const readMusicTag = async (musicSrc: string): Promise<mm.IAudioMetadata> => {
  const metadata = await mm.fetchFromUrl(musicSrc);
  return metadata;
};
interface MusicContext {
  nas: Nas;
  isLoading: boolean;
  errorMsg?: string;
  update(): void;
  currentTag?: mm.IAudioMetadata;
  currentMusic?: NasFile;
  musicResponse?: PaginationResponse<NasFile>;
  play(music: NasFile): Promise<void>;
  stop(): void;
  fetch(url: string): Promise<void>;
  search(k: string): Promise<void>;
}

interface MusicProps {}

export class MusicProvider extends Component<MusicProps, MusicContext> {
  constructor(props: MusicProps) {
    super(props);
    this.state = {
      nas: new Nas(),
      isLoading: false,
      update: this.update,
      play: this.play,
      stop: this.stop,
      fetch: this.fetch,
      search: this.search
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true, errorMsg: "Loading Music Library" });
    let musicList = await this.state.nas.fetchMusicList();
    setTimeout(() => {
      this.setState({ musicResponse: musicList, isLoading: false });
    }, 400);
    setTimeout(() => {
      this.setState({ errorMsg: undefined });
    }, 3000);
  }

  search = async (keyword: string) => {
    try {
      let response = await Axios.get<PaginationResponse<NasFile>>(
        `${musicURL}?search=${keyword}`
      );
      this.setState({ musicResponse: response.data });
    } catch (err) {
      this.setState({ errorMsg: err });
    }
  };

  fetch = async (url: string) => {
    try {
      this.setState({ isLoading: true });
      let response = await Axios.get<PaginationResponse<NasFile>>(url);
      this.setState({ musicResponse: response.data });
    } catch (err) {
      this.setState({ errorMsg: err });
    } finally {
      this.setState({ isLoading: false });
      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      }, 1000);
    }
  };

  play = async (music: NasFile) => {
    let tag = await readMusicTag(music.file);
    this.setState({ currentTag: tag, currentMusic: music });
  };

  stop = async () => {
    this.setState({ currentTag: undefined, currentMusic: undefined });
  };

  update = () => {
    this.setState({
      nas: this.state.nas
    });
  };

  render() {
    return (
      <MusicContext.Provider value={this.state}>
        {this.props.children}
      </MusicContext.Provider>
    );
  }
}

//@ts-ignore
const context: MusicContext = {
  nas: new Nas(),
  update: () => {},
  stop: () => {},
  play: (music: NasFile) => {
    return Promise.resolve();
  },
  isLoading: false
};

export const MusicContext = React.createContext(context);
