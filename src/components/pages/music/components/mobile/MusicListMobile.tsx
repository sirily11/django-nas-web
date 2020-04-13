import React from "react";
import {
  List,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Typography,
  Divider,
  CardMedia
} from "@material-ui/core";
import { MusicContext } from "../../../../models/MusicContext";
import { TableBody, TableFooter } from "semantic-ui-react";
import * as path from "path";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import Pagination from "@material-ui/lab/Pagination";
import { IconButton } from "@material-ui/core";
import { musicURL } from "../../../../models/urls";
import { File as NasFile } from "../../../../models/Folder";
import ListItem from "@material-ui/core/ListItem";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import FavoriteIcon from "@material-ui/icons/Favorite";

export default function MusicListMobile() {
  const {
    musicResponse,
    play,
    currentMusic,
    stop,
    fetch,
    paginationURL,
    presslike
  } = React.useContext(MusicContext);
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setheight] = React.useState(window.innerHeight);

  const isSelected = (
    file: NasFile | undefined,
    file2: NasFile | undefined
  ): boolean => {
    return file?.id === file2?.id;
  };

  return (
    <div style={{ marginTop: 10 }}>
      <List>
        {musicResponse &&
          musicResponse.results.map((m, i) => (
            <div>
              <ListItem
                button
                selected={isSelected(currentMusic, m)}
                onClick={async () => {
                  if (isSelected(currentMusic, m)) {
                  } else {
                    await play(m);
                  }
                }}
                style={{ height: 80 }}
              >
                <ListItemIcon>
                  <CardMedia
                    style={{ height: 40, width: 40 }}
                    image={m.music_metadata?.picture}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography noWrap>
                      {m.music_metadata?.title ?? path.basename(m.filename)}
                    </Typography>
                  }
                  secondary={
                    <Typography noWrap>{m.music_metadata?.album}</Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={async () => {
                      await presslike(m);
                    }}
                  >
                    <FavoriteIcon
                      style={{
                        color: m.music_metadata?.like ? "pink" : undefined
                      }}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider style={{ color: "black", marginLeft: 50 }} />
            </div>
          ))}
      </List>
      <Pagination
        size="medium"
        style={{ marginBottom: 10, marginTop: 10, height: 140 }}
        page={musicResponse?.current_page ?? 0}
        count={musicResponse?.total_pages ?? 0}
        onChange={async (e, value) => {
          if (paginationURL === musicURL) {
            await fetch(`${musicURL}?page=${value}`);
          } else {
            await fetch(`${paginationURL}&page=${value}`);
          }
        }}
      />
    </div>
  );
}
