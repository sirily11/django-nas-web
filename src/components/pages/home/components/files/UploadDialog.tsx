// @ts-nocheck
import React, { useState, useContext } from "react";
import {
  Modal,
  Segment,
  Progress,
  Grid,
  Button,
  Icon
} from "semantic-ui-react";
import { HomePageContext } from "../../../../models/HomeContext";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  isDir: boolean;
}

export interface UploadInfo {
  currentName: string;
  progress: number;
  total: number;
  currentIndex: number;
  uploadedDataSize: number;
  totalDataSize: number;
}

export default function UploadDialog(props: Props) {
  const {
    nas,
    update,
    uploadInfo,
    setUploadInfo,
    uploadFiles,
    updateUploadInfo
  } = useContext(HomePageContext);

  const onInputChange = e => {
    let uploadFiles = e.target.files;
    if (uploadFiles) {
      let l: File[] = [];
      for (var i = 0; i < uploadFiles.length; i++) {
        l.push(uploadFiles[i]);
      }

      setUploadInfo(l);
    }
  };

  return (
    <Modal open={props.open}>
      <Modal.Header>Select {props.isDir ? "Folder" : "Files"} </Modal.Header>
      <Modal.Content>
        <Grid.Row>
          {props.isDir ? (
            <input
              type="file"
              multiple
              webkitdirectory=""
              name="Upload file"
              onChange={onInputChange}
            />
          ) : (
            <input
              type="file"
              multiple
              name="Upload file"
              onChange={onInputChange}
            />
          )}
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
              {uploadInfo.currentName} {uploadInfo.currentIndex}/
              {uploadInfo.total} --- {uploadInfo.progress} %
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
          <Icon name="remove" /> {uploadInfo ? "Minimize" : "Close"}
        </Button>
        <Button
          disabled={uploadFiles === undefined}
          color="green"
          loading={uploadInfo !== undefined}
          inverted
          onClick={async () => {
            if (uploadFiles) {
              await nas.uploadFile(
                uploadFiles,
                props.isDir,
                (
                  index: number,
                  progress: number,
                  current: number,
                  total: number
                ) => {
                  updateUploadInfo({
                    total: uploadFiles.length,
                    currentIndex: index,
                    currentName: uploadFiles[index]
                      ? uploadFiles[index].name
                      : "Finished",
                    progress: progress,
                    uploadedDataSize: current,
                    totalDataSize: total
                  });
                }
              );
              update();
              setTimeout(() => {
                props.setOpen(false);
                setUploadInfo(undefined);
                updateUploadInfo(undefined);
              }, 300);
            }
          }}
        >
          <Icon name="checkmark" /> Upload
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
