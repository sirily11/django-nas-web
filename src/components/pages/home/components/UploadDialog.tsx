import React, { useState, useContext } from "react";
import {
  Modal,
  Segment,
  Progress,
  Grid,
  Button,
  Icon
} from "semantic-ui-react";
import { HomePageContext } from "../../../models/HomeContext";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
}

interface UploadInfo {
  currentName: string;
  progress: number;
  total: number;
  currentIndex: number;
}

export default function UploadDialog(props: Props) {
  const { nas, update } = useContext(HomePageContext);

  const [files, setFiles] = useState<File[]>();
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>();

  return (
    <Modal open={props.open}>
      <Modal.Header>Select files</Modal.Header>
      <Modal.Content>
        <Grid.Row>
          <input
            type="file"
            multiple
            name="Upload file"
            onChange={e => {
              let uploadFiles = e.target.files;
              if (uploadFiles) {
                let l: File[] = [];
                for (var i = 0; i < uploadFiles.length; i++) {
                  l.push(uploadFiles[i]);
                }
                setFiles(l);
              }
            }}
          ></input>
        </Grid.Row>
        {uploadInfo && (
          <Grid.Row style={{ marginTop: 20 }}>
            <Segment>
              <Progress
                percent={uploadInfo.progress}
                attached="top"
                color="green"
                active
              />
              {uploadInfo.currentName} {uploadInfo.currentIndex} /{" "}
              {uploadInfo.total}
              <Progress
                percent={(uploadInfo.currentIndex / uploadInfo.total) * 100}
                attached="bottom"
                color="blue"
                active
              />
            </Segment>
          </Grid.Row>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" onClick={() => props.setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
          disabled={files === undefined}
          color="green"
          inverted
          onClick={async () => {
            if (files) {
              await nas.uploadFile(files, (index: number, progress: number) => {
                setUploadInfo({
                  total: files.length,
                  currentIndex: index,
                  currentName: files[index] ? files[index].name : "Finished",
                  progress: progress
                });
              });
              update();
              setTimeout(() => {
                props.setOpen(false);
                setFiles(undefined);
                setUploadInfo(undefined);
              }, 300);
            }
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
