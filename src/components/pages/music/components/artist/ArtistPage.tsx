import React from "react";
import {
  Paper,
  Divider,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  Grid,
  DialogContent,
  CardMedia,
  Card,
  Typography,
  CardActionArea
} from "@material-ui/core";
import { MusicContext } from "../../../../models/MusicContext";
import { Container, CardContent } from "semantic-ui-react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";

export default function ArtistPage() {
  const {
    artists,
    setTabIndex,
    getAlbumsByArtist,
    artistDetail
  } = React.useContext(MusicContext);
  const [showDialog, setShowDialog] = React.useState(false);

  return (
    <Container>
      <Paper>
        <List>
          {artists.map((a, i) => (
            <div>
              <ListItem
                onClick={async () => {
                  await getAlbumsByArtist(a.artist);
                  setShowDialog(true);
                }}
                button
                key={`artist-${i}`}
                style={{ height: 50 }}
              >
                <ListItemAvatar>
                  <PeopleIcon />
                </ListItemAvatar>
                <ListItemText primary={a.artist}></ListItemText>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
      <Dialog
        open={showDialog}
        fullWidth
        scroll="paper"
        onClose={() => setShowDialog(false)}
      >
        <DialogTitle>
          {artistDetail.length > 0 && artistDetail[0].artist}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {artistDetail.map((a, i) => (
              <Grid item key={`artist-detail-${i}`} xs={6}>
                <Card elevation={0}>
                  <CardActionArea
                    onClick={() => {
                      setShowDialog(false);
                      window.location.replace("#music/?album=" + a.album);
                      setTabIndex(0);
                    }}
                  >
                    <CardMedia style={{ height: 250 }} image={a.picture} />
                    <CardContent>
                      <Typography>{a.album}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
