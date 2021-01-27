/** @format */

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  CardContent,
  Typography,
  CardMedia,
} from "@material-ui/core";
import * as path from "path";
import AudioPlayer from "react-h5-audio-player";
import jsmediatags from "jsmediatags";
import "react-h5-audio-player/lib/styles.css";
import { TagType } from "jsmediatags/types";
import * as mm from "music-metadata-browser";
import { Grid } from "semantic-ui-react";

interface Props {
  musicSrc: string;
  onClose(): void;
}

interface State {
  tag?: mm.IAudioMetadata;
}

const readMusicTag = async (musicSrc: string): Promise<mm.IAudioMetadata> => {
  const metadata = await mm.fetchFromUrl(musicSrc);
  return metadata;
};

export default class Musicplayer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const { musicSrc } = this.props;
    let data = await readMusicTag(musicSrc);
    this.setState({ tag: data });
  }

  async componentDidUpdate(oldProps: Props) {
    const { musicSrc } = this.props;
    if (oldProps.musicSrc !== musicSrc) {
      let data = await readMusicTag(musicSrc);
      this.setState({ tag: data });
    }
  }

  render() {
    const { musicSrc, onClose } = this.props;
    const { tag } = this.state;
    const pictures = tag?.common.picture;
    let picture: string | undefined = undefined;
    if (pictures && pictures.length > 0) {
      picture = pictures[0].data.toString("base64");
      picture = "data:image/jpeg;base64," + picture;
    }
    return (
      <Dialog
        fullWidth
        open={musicSrc !== undefined}
        onClose={() => onClose()}
        style={{ overflowX: "hidden" }}
      >
        <CardMedia
          style={{ height: 500, width: "100%" }}
          image={picture}
          title={decodeURIComponent(
            tag?.common.title ?? path.basename(musicSrc)
          )}
        />
        <DialogContent>
          <Typography component="h5" variant="h5">
            {decodeURIComponent(tag?.common.title ?? path.basename(musicSrc))}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {tag?.common.artist}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {tag?.common.album}
          </Typography>
        </DialogContent>
        <div>
          <AudioPlayer volume={0.5} src={musicSrc} />
        </div>
      </Dialog>
    );
  }
}
