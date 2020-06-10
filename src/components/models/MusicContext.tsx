import React, { Component } from "react";
import { Nas } from "./interfaces/nas";
import { RouteComponentProps } from "react-router";
import {
  Folder,
  Document as NasDocument,
  File as NasFile,
  PaginationResponse
} from "./interfaces/Folder";
import Axios from "axios";
import * as mm from "music-metadata-browser";
import { musicURL, musicMetadataURL } from "./urls";
import queryString from "query-string";
import { MusicMetadata } from "./interfaces/Folder";
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
  currentTabIndex: number;
  update(): void;
  currentTag?: mm.IAudioMetadata;
  currentMusic?: NasFile;
  musicResponse?: PaginationResponse<NasFile>;
  paginationURL: string;
  albums: MusicMetadata[];
  artists: MusicMetadata[];
  artistDetail: MusicMetadata[];
  isSearching: boolean;
  updateMetadata(): Promise<void>;
  play(music: NasFile): Promise<void>;
  stop(): void;
  fetch(url: string): Promise<void>;
  search(k: string): Promise<void>;
  setTabIndex(index: number): Promise<void>;
  getAlbumsByArtist(artist: string): Promise<void>;
  presslike(file: NasFile): Promise<void>;
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
      currentTabIndex: 0,
      artistDetail: [],
      albums: [],
      artists: [],
      isSearching: false,
      update: this.update,
      play: this.play,
      stop: this.stop,
      fetch: this.fetch,
      search: this.search,
      updateMetadata: this.updateMetadata,
      setTabIndex: this.setTabIndex,
      getAlbumsByArtist: this.getAlbumsByArtist,
      presslike: this.presslike
    };
  }

  async componentDidUpdate(oldProps: MusicProps) {
    if (
      this.props.location.search !== oldProps.location.search &&
      !this.state.isSearching
    ) {
      console.log("update");
      await this.init();
    }
  }

  async componentDidMount() {
    console.log("init");
    await this.init();
  }

  getAlbumsByArtist = async (artist: string) => {
    try {
      let response = await Axios.get<MusicMetadata[]>(
        `${musicURL}album/?artist=${artist}`
      );
      this.setState({ artistDetail: response.data });
    } catch (err) {
      this.setState({ errorMsg: err });
    } finally {
      setTimeout(() => {
        this.setState({ errorMsg: undefined, isLoading: false });
      });
    }
  };

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

  setTabIndex = async (index: number) => {
    const prevIndex = this.state.currentTabIndex;
    this.setState({ currentTabIndex: index, isLoading: true });
    switch (index) {
      case 1:
        let albumResponse = await Axios.get(`${musicURL}album/`);
        this.setState({ albums: albumResponse.data, isLoading: false });
        break;
      case 2:
        let artistResonse = await Axios.get(`${musicURL}artist/`);
        this.setState({ artists: artistResonse.data, isLoading: false });
        break;

      case 3:
        await this.fetch(`${musicURL}?like=true/`);
        break;

      default:
        if (prevIndex === 3) {
          await this.init();
        }
        this.setState({ isLoading: false });
    }
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
    this.setState({ isSearching: true });
    window.location.replace("#/music");
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
          isLoading: false,
          filterField: undefined
        });
        setTimeout(() => {
          this.setState({ errorMsg: undefined });
        }, 3000);
      }
    } catch (err) {
      this.setState({ errorMsg: err });
    } finally {
      this.setState({ isSearching: false });
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

  presslike = async (file: NasFile) => {
    try {
      if (file.music_metadata) {
        let response = await Axios.patch(
          `${musicMetadataURL}${file.music_metadata?.id}/`,
          { like: !file.music_metadata?.like }
        );
        file.music_metadata.like = !file.music_metadata.like;
        this.setState({ musicResponse: this.state.musicResponse });
      }
    } catch (err) {
      this.setState({ errorMsg: err });
      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      });
    }
  };

  play = async (music: NasFile) => {
    this.setState({ currentMusic: music });
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
