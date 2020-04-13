import React from "react";
import {
  Container,
  Grid,
  CardMedia,
  Typography,
  Card,
  CardActions,
  CardActionArea,
  CardContent
} from "@material-ui/core";
import { MusicContext } from "../../../../models/MusicContext";
//@ts-ignore
import LazyLoad from "react-lazyload";

export default function AlbumPage() {
  const { albums, setTabIndex } = React.useContext(MusicContext);

  return (
    <Container>
      <Grid container spacing={2}>
        {albums.map((a, i) => (
          <Grid item xs={6} md={4} lg={3} key={`album-${i}`}>
            <Card>
              <CardActionArea
                style={{ height: 300 }}
                onClick={async () => {
                  window.location.replace("#music/?album=" + a.album);
                  setTabIndex(0);
                }}
              >
                {i < 5 ? (
                  <CardMedia
                    style={{ height: 200, width: "100%" }}
                    image={a.picture}
                  />
                ) : (
                  <LazyLoad height={200} offset={120}>
                    <CardMedia
                      style={{ height: 200, width: "100%" }}
                      image={a.picture}
                    />
                  </LazyLoad>
                )}

                <CardContent>
                  <Typography>{a.album}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
