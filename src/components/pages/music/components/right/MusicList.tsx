import React from "react";
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography
} from "@material-ui/core";
import { MusicContext } from "../../../../models/MusicContext";
import { TableBody, TableFooter } from "semantic-ui-react";
import * as path from "path";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import Pagination from "@material-ui/lab/Pagination";
import { IconButton, Grid } from "@material-ui/core";
import { musicURL } from "../../../../models/urls";
import { File as NasFile } from "../../../../models/Folder";
import moment from "moment";
import { NavLink } from "react-router-dom";
import FavoriteIcon from "@material-ui/icons/Favorite";

export default function MusicList() {
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
    <TableContainer
      component={Paper}
      style={{
        marginTop: "40px",
        marginLeft: 30,
        maxHeight: height - 180,
        width: "100%"
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {musicResponse &&
            musicResponse.results.map((m, i) => (
              <TableRow selected={isSelected(currentMusic, m)}>
                <TableCell style={{ maxWidth: 200 }}>
                  <Grid container>
                    <Grid item xs={3}>
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
                    </Grid>
                    <Grid item xs={9}>
                      <Typography noWrap>
                        {m.music_metadata?.title ?? path.basename(m.filename)}
                      </Typography>
                      <NavLink
                        to={
                          m.music_metadata?.album !== undefined
                            ? `/music?album=${m.music_metadata?.album}`
                            : "/music"
                        }
                      >
                        <Typography variant="subtitle1" noWrap>
                          {m.music_metadata?.album}
                        </Typography>
                      </NavLink>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell style={{ maxWidth: 100 }}>
                  <NavLink
                    to={
                      m.music_metadata?.artist !== undefined
                        ? `/music?artist=${m.music_metadata?.artist}`
                        : "/music"
                    }
                  >
                    <Typography variant="subtitle1" noWrap>
                      {m.music_metadata?.artist}
                    </Typography>
                  </NavLink>
                </TableCell>
                <TableCell>
                  {m?.music_metadata?.duration &&
                    moment
                      .utc(m?.music_metadata?.duration * 1000)
                      .format("mm:ss")}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={async () => {
                      if (isSelected(currentMusic, m)) {
                        stop();
                      } else {
                        await play(m);
                      }
                    }}
                  >
                    {isSelected(currentMusic, m) ? (
                      <StopIcon />
                    ) : (
                      <PlayArrowIcon />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <Pagination
              size="medium"
              style={{ marginBottom: 10, marginTop: 10 }}
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
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
