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
import queryString from "query-string";
//@ts-ignore
const readMusicTag = async (musicSrc: string): Promise<mm.IAudioMetadata> => {
  const metadata = await mm.fetchFromUrl(musicSrc);
  return metadata;
};
interface MusicContext {
  nas: Nas;
  filterField?: string;
  isLoading: boolean;
  errorMsg?: string;
  update(): void;
  currentTag?: mm.IAudioMetadata;
  currentMusic?: NasFile;
  musicResponse?: PaginationResponse<NasFile>;
  paginationURL: string;
  updateMetadata(): Promise<void>;
  play(music: NasFile): Promise<void>;
  stop(): void;
  fetch(url: string): Promise<void>;
  search(k: string): Promise<void>;
}

interface RouterProps {
  artist?: string;
  album?: string;
}

interface MusicProps extends RouteComponentProps<RouterProps> {}

export class MusicProvider extends Component<MusicProps, MusicContext> {
  constructor(props: MusicProps) {
    super(props);
    this.state = {
      nas: new Nas(),
      paginationURL: musicURL,
      isLoading: false,
      update: this.update,
      play: this.play,
      stop: this.stop,
      fetch: this.fetch,
      search: this.search,
      updateMetadata: this.updateMetadata
    };
  }

  async componentDidUpdate(oldProps: MusicProps) {
    if (this.props.location.search !== oldProps.location.search) {
      console.log("update");
      await this.init();
    }
  }

  async componentDidMount() {
    console.log("init");
    await this.init();
  }

  init = async () => {
    this.setState({ isLoading: true, errorMsg: "Loading Music Library" });
    const values: RouterProps = queryString.parse(this.props.location.search);
    let musicList: any;
    if (values.artist) {
      musicList = await this.filterBy("artist", values.artist);
    } else if (values.album) {
      musicList = await this.filterBy("album", values.album);
    } else {
      musicList = await this.state.nas.fetchMusicList();
      this.setState({ filterField: undefined });
    }

    this.setState({ musicResponse: musicList });
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 400);
    setTimeout(() => {
      this.setState({ errorMsg: undefined });
    }, 3000);
  };

  /**
   * Get data filter by field with keyword
   */
  filterBy = async (field: string, keyword: string) => {
    try {
      this.setState({ filterField: keyword });
      let response = await Axios.get(`${musicURL}?${field}=${keyword}`);
      return response.data;
    } catch (err) {
      this.setState({ errorMsg: err });
    }
  };

  updateMetadata = async () => {
    this.setState({
      isLoading: true,
      errorMsg: "Updating music metadata... This may take while"
    });
    try {
      await Axios.patch(`${musicURL}`);
      let response = await Axios.get<PaginationResponse<NasFile>>(musicURL);
      this.setState({ musicResponse: response.data });
    } catch (err) {
      this.setState({ errorMsg: err });
    } finally {
      this.setState({ isLoading: false });
      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      }, 3000);
    }
  };

  search = async (keyword: string) => {
    this.setState({ isLoading: true });
    try {
      if (keyword === "") {
        let musicList = await this.state.nas.fetchMusicList();
        this.setState({
          musicResponse: musicList,
          isLoading: false,
          paginationURL: musicURL
        });
      } else {
        this.setState({ errorMsg: "Searching " + keyword });
        let searchURL = `${musicURL}?search=${keyword}`;
        let response = await Axios.get<PaginationResponse<NasFile>>(searchURL);
        this.setState({
          musicResponse: response.data,
          paginationURL: searchURL,
          isLoading: false
        });
        setTimeout(() => {
          this.setState({ errorMsg: undefined });
        }, 3000);
      }
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
