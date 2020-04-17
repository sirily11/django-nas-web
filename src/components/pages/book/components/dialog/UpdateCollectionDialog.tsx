import React from "react";
import {
  Document as NasDocument,
  BookCollection
} from "../../../../models/Folder";
import { BookContext } from "../../../../models/BookContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  DialogActions,
  LinearProgress,
  Collapse,
  TextField
} from "@material-ui/core";

interface Props {
  open: boolean;
  onClose(name?: string, description?: string): Promise<void>;
}

export default function UpdateCollectionDialog(props: Props) {
  const { open, onClose } = props;
  const { books, currentBook } = React.useContext(BookContext);
  const [name, setname] = React.useState<string | undefined>(currentBook?.name);
  const [description, setdescription] = React.useState<string | undefined>(
    currentBook?.description
  );
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Update collection info </DialogTitle>
      <DialogContent>
        <Collapse in={isLoading} mountOnEnter unmountOnExit>
          <LinearProgress />
        </Collapse>
        <TextField
          onChange={e => setname(e.target.value)}
          value={name}
          label="Name"
          title="Name"
          fullWidth
        />
        <TextField
          value={description}
          label="Description"
          title="Description"
          fullWidth
          multiline
          onChange={e => setdescription(e.target.value)}
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={async () => {
            setIsLoading(true);
            await onClose();
            setIsLoading(false);
          }}
        >
          Close
        </Button>
        <Button
          onClick={async () => {
            setIsLoading(true);
            await onClose(name, description);
            setIsLoading(false);
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
