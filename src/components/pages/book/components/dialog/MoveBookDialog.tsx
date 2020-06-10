import React from "react";
import {
  Document as NasDocument,
  BookCollection
} from "../../../../models/interfaces/Folder";
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
  Collapse
} from "@material-ui/core";

interface Props {
  open: boolean;
  onClose(id?: BookCollection): Promise<void>;
  currentDoc?: NasDocument;
}

export default function MoveBookDialog(props: Props) {
  const { open, onClose, currentDoc } = props;
  const { books } = React.useContext(BookContext);
  const [selectedId, setSelectedId] = React.useState<number | undefined>(
    currentDoc?.collection
  );
  console.log(currentDoc);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Move Document to Collection </DialogTitle>
      <DialogContent>
        <Collapse in={isLoading} mountOnEnter unmountOnExit>
          <LinearProgress />
        </Collapse>

        <FormControl fullWidth>
          <InputLabel>Book Collections</InputLabel>
          <Select
            value={selectedId}
            onChange={e => {
              setSelectedId(e.target.value as number);
            }}
          >
            {books.map((b, i) => (
              <MenuItem key={`book-selection-${i}`} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            if (selectedId) {
              const book = books.filter(b => b.id === selectedId);
              if (book.length > 0) {
                await onClose(book[0]);
              }
            }

            setIsLoading(false);
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
