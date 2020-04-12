import React from "react";
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell
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

export default function MusicList() {
  const {
    musicResponse,
    play,
    currentMusic,
    stop,
    fetch,
    paginationURL
  } = React.useContext(MusicContext);
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setheight] = React.useState(window.innerHeight);
  const isSelected = (
    file: NasFile | undefined,
    file2: NasFile | undefined
  ): boolean => {
    return file?.id === file2?.id;
  };

  window.addEventListener("resize", e => {
    setWidth(window.innerWidth);
    setheight(window.innerHeight);
  });

  return (
    <TableContainer
      component={Paper}
      style={{
        marginTop: "40px",
        marginLeft: 30,
        maxHeight: width < 960 ? height / 2 : height - 100
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {musicResponse &&
            musicResponse.results.map((m, i) => (
              <TableRow selected={isSelected(currentMusic, m)}>
                <TableCell>{path.basename(m.filename)}</TableCell>
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
