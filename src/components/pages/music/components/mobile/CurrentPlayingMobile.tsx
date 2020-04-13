import React from "react";
import * as mm from "music-metadata-browser";
import Skeleton from "@material-ui/lab/Skeleton";
import AudioPlayer from "react-h5-audio-player";
import {
  CardMedia,
  CardContent,
  Typography,
  Collapse,
  Paper,
  Grid,
  Card,
  IconButton,
  Dialog,
  Toolbar,
  DialogContent,
  Slide,
  CardActions,
  Slider
} from "@material-ui/core";
import { MusicContext } from "../../../../models/MusicContext";
import * as moment from "moment";
import * as path from "path";
//@ts-ignore
import AudioSpectrum from "react-audio-spectrum";
import CloseIcon from "@material-ui/icons/Close";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import StopIcon from "@material-ui/icons/Stop";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import RepeatIcon from "@material-ui/icons/Repeat";
import RepeatOneIcon from "@material-ui/icons/RepeatOne";

const getMusicPicture = (tag?: mm.IAudioMetadata) => {
  const pictures = tag?.common.picture;
  let picture: string | undefined = undefined;
  if (pictures && pictures.length > 0) {
    picture = pictures[0].data.toString("base64");
    picture = "data:image/jpeg;base64," + picture;
  }
  return picture;
};
const IMAGE_SIZE = 70;
const LARGE_IMAGE_SIZE = 300;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CurrentPlayingMobile() {
  const { currentMusic, currentTag, stop } = React.useContext(MusicContext);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState<number>();
  const [totalTime, setTotalTime] = React.useState<number>();
  const [volume, setVolume] = React.useState<number | undefined>(0.5);
  const [repeat, setRepeat] = React.useState(false);
  const [playingState, setPlayingState] = React.useState<"playing" | "pause">(
    "playing"
  );
  let player = React.useRef<HTMLAudioElement>(null);

  return (
    <div style={{ margin: 10 }}>
      <Card>
        <Grid
          style={{ marginLeft: 10, marginRight: 10 }}
          container
          alignItems="center"
        >
          <Grid item xs={3}>
            {currentMusic ? (
              <CardMedia
                style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
                image={
                  currentMusic?.music_metadata?.picture ??
                  getMusicPicture(currentTag)
                }
              />
            ) : (
              <Skeleton width={IMAGE_SIZE} height={IMAGE_SIZE} />
            )}
          </Grid>
          <Grid item xs={7}>
            {currentMusic && (
              <audio
                onVolumeChange={() => {
                  setVolume(player.current?.volume);
                }}
                onCanPlay={() => {
                  setCurrentTime(player.current?.currentTime);
                  setTotalTime(player.current?.duration);
                  if (player.current) {
                    player.current.volume = volume ?? 0.5;
                    setVolume(volume);
                    player.current.loop = repeat;
                  }
                }}
                crossOrigin="anonymous"
                onTimeUpdate={e => {
                  setCurrentTime(player.current?.currentTime);
                  setTotalTime(player.current?.duration);
                }}
                autoPlay
                src={currentMusic?.file}
                ref={player}
              />
            )}
            <CardActions
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              {currentMusic === undefined && (
                <Typography component="div">No Music Playing</Typography>
              )}
              <Typography noWrap>
                {decodeURIComponent(
                  currentMusic?.music_metadata?.title ??
                    path.basename(currentMusic?.filename ?? "")
                )}
              </Typography>
            </CardActions>
          </Grid>
          <Grid item xs={2}>
            {currentMusic && (
              <IconButton onClick={e => stop()} size="medium">
                <StopIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Card>
      {/** popup dialog */}
      <Dialog open={openDialog} fullScreen TransitionComponent={Transition}>
        <Toolbar>
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <DialogContent>
          <div>
            {currentMusic ? (
              <CardMedia
                style={{ height: LARGE_IMAGE_SIZE, width: "100%" }}
                image={
                  currentMusic?.music_metadata?.picture ??
                  getMusicPicture(currentTag)
                }
              />
            ) : (
              <Skeleton width="100%" height={LARGE_IMAGE_SIZE} />
            )}
          </div>
          <div>
            <Typography component="h5" variant="h5" noWrap>
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
          </div>
          <div>
            <Grid container spacing={2}>
              <Grid item xs>
                <Slider
                  value={currentTime}
                  max={totalTime}
                  onChange={(e, v) => {
                    if (player.current) {
                      player.current.currentTime = v as number;
                    }
                  }}
                  aria-labelledby="continuous-slider"
                />
              </Grid>
            </Grid>
            <Grid justify="space-between" container>
              <Grid item>
                {currentTime && moment.utc(currentTime * 1000).format("mm:ss")}
              </Grid>
              <Grid item>
                {totalTime && moment.utc(totalTime * 1000).format("mm:ss")}
              </Grid>
            </Grid>
            <Grid item style={{ textAlign: "center" }}>
              <IconButton
                disabled={currentMusic === undefined}
                size="medium"
                onClick={() => {
                  if (currentMusic && player && player.current) {
                    if (playingState === "playing") {
                      setPlayingState("pause");
                      player.current?.pause();
                    } else {
                      setPlayingState("playing");
                      player.current?.play();
                    }
                  }
                }}
              >
                {playingState === "playing" ? (
                  <PauseIcon style={{ fontSize: 40 }} />
                ) : (
                  <PlayArrowIcon style={{ fontSize: 40 }} />
                )}
              </IconButton>
            </Grid>
          </div>
          <Grid container justify="center">
            <IconButton
              onClick={() => {
                if (player.current) {
                  if (repeat) {
                    setRepeat(false);
                    player.current.loop = false;
                  } else {
                    setRepeat(true);
                    player.current.loop = true;
                  }
                }
              }}
            >
              {repeat ? <RepeatOneIcon /> : <RepeatIcon />}
            </IconButton>
          </Grid>
          <Grid container spacing={2}>
            <Grid item>
              <VolumeDown />
            </Grid>
            <Grid item xs>
              <Slider
                value={volume && volume * 100}
                min={0}
                max={100}
                onChange={(e, v) => {
                  if (player.current) {
                    player.current.volume = (v as number) / 100;
                  }
                }}
                aria-labelledby="continuous-slider"
              />
            </Grid>
            <Grid item>
              <VolumeUp />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
