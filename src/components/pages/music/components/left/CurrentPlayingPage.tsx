import React from "react";
import * as mm from "music-metadata-browser";
import AudioPlayer from "react-h5-audio-player";
import {
  CardMedia,
  CardContent,
  Typography,
  Collapse
} from "@material-ui/core";
import { MusicContext } from "../../../../models/MusicContext";
import * as path from "path";
//@ts-ignore
import AudioSpectrum from "react-audio-spectrum";

const getMusicPicture = (tag?: mm.IAudioMetadata) => {
  const pictures = tag?.common.picture;
  let picture: string | undefined = undefined;
  if (pictures && pictures.length > 0) {
    picture = pictures[0].data.toString("base64");
    picture = "data:image/jpeg;base64," + picture;
  }
  return picture;
};

export default function CurrentPlayingPage() {
  const { currentMusic, currentTag } = React.useContext(MusicContext);
  let player = React.createRef<HTMLAudioElement | undefined>();
  return (
    <div style={{ marginTop: 40 }}>
      <Collapse in={currentMusic === undefined} mountOnEnter unmountOnExit>
        <Typography variant="subtitle1">No Music Selected</Typography>
      </Collapse>
      <Collapse
        in={currentMusic?.music_metadata?.picture !== undefined}
        mountOnEnter
        unmountOnExit
      >
        <CardMedia
          style={{
            height: 300,
            width: "100%",

            marginLeft: "auto",
            marginRight: "auto"
          }}
          image={
            currentMusic?.music_metadata?.picture ?? getMusicPicture(currentTag)
          }
        />
      </Collapse>
      <Collapse in={currentMusic !== undefined} mountOnEnter unmountOnExit>
        <CardContent
          style={{
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Typography component="h5" variant="h5">
            {decodeURIComponent(
              currentMusic?.music_metadata?.title ??
                path.basename(currentMusic?.filename ?? "")
            )}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {decodeURIComponent(currentMusic?.music_metadata?.artist ?? "")}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {decodeURIComponent(currentMusic?.music_metadata?.album ?? "")}
          </Typography>
          {currentMusic && (
            <audio
              controls
              loop
              crossOrigin="anonymous"
              autoPlay
              src={currentMusic?.file}
              id="music"
            />
          )}
          {currentMusic && (
            <AudioSpectrum
              id="audio-canvas"
              height={200}
              width={300}
              meterWidth={6}
              audioId="music"
            />
          )}
        </CardContent>
      </Collapse>
    </div>
  );
}
