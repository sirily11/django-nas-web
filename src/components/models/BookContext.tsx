import React, { Component } from "react";
import { Nas } from "./nas";
import { RouteComponentProps } from "react-router";
import {
  Folder,
  Document as NasDocument,
  File as NasFile,
  BookCollection
} from "./Folder";
import { UploadInfo } from "../pages/home/components/files/UploadDialog";
import * as path from "path";
import Axios from "axios";
import { bookCollectionURL, documentURL } from "./urls";

interface BookContext {
  nas: Nas;
  isLoading: boolean;
  errorMsg?: string;
  books: BookCollection[];
  currentBook?: BookCollection;
  fetchBookDetail(id: number): Promise<BookCollection | undefined>;
  deleteDocument(id: number): Promise<void>;
  moveDocumentTo(doc: NasDocument, dest: BookCollection): Promise<void>;
  createDocument(title: string, dest: BookCollection): Promise<void>;
  addNewBook(title: string, desc: string): Promise<void>;
  updateBook(title: string, desc: string): Promise<void>;
  deleteBook(book: BookCollection): Promise<void>;
  onCloseDetailDialog(): void;
}

interface BookProps {}

export class BookProvider extends Component<BookProps, BookContext> {
  constructor(props: BookProps) {
    super(props);
    this.state = {
      nas: new Nas(),
      isLoading: false,
      books: [],
      deleteBook: this.deleteBook,
      addNewBook: this.addNewBook,
      updateBook: this.updateBook,
      createDocument: this.createDocument,
      moveDocumentTo: this.moveDocumentTo,
      deleteDocument: this.deleteDocument,
      fetchBookDetail: this.fetchBookDetail,
      onCloseDetailDialog: this.onCloseDetailDialog
    };
  }

  async componentDidMount() {
    await this.fetch();
  }

  fetch = async () => {
    this.setState({ isLoading: true });
    try {
      let response = await Axios.get<BookCollection[]>(bookCollectionURL);
      this.setState({ books: response.data });
    } catch (err) {
      this.setState({ errorMsg: err });
    } finally {
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 300);
      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      }, 3000);
    }
  };

  onCloseDetailDialog = () => {
    this.setState({ currentBook: undefined });
  };

  fetchBookDetail = async (
    id: number,
    showLoading = true
  ): Promise<BookCollection | undefined> => {
    try {
      if (showLoading) {
        this.setState({ isLoading: true });
      }

      let response = await Axios.get<BookCollection>(
        `${bookCollectionURL}${id}/`
      );
      this.setState({ currentBook: response.data });
      return response.data;
    } catch (err) {
      this.setState({ errorMsg: err });
    } finally {
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 300);
      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      }, 3000);
    }
    return;
  };

  deleteDocument = async (id: number): Promise<void> => {
    try {
      let response = await Axios.delete(`${documentURL}${id}/`);
      if (this.state.currentBook) {
        await this.fetchBookDetail(this.state.currentBook.id, false);
      }
    } catch (err) {
      this.setState({ errorMsg: err });
    } finally {
      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      }, 3000);
    }
  };
  moveDocumentTo = async (
    doc: NasDocument,
    dest: BookCollection
  ): Promise<void> => {
    try {
      let resp = await Axios.patch(`${documentURL}${doc.id}/`, {
        collection: dest.id
      });
      if (this.state.currentBook) {
        await this.fetchBookDetail(this.state.currentBook?.id, false);
      }
    } catch (err) {
      this.setState({ errorMsg: err });
    } finally {
      setTimeout(() => {
        this.setState({ errorMsg: undefined });
      }, 3000);
    }
  };

  createDocument = async (
    title: string,
    dest: BookCollection
  ): Promise<void> => {
    try {
      let response = await Axios.post(`${documentURL}/`, {
        collection: dest.id,
        name: title,
        show_in_folder: false
      });
      if (this.state.currentBook) {
        await this.fetchBookDetail(this.state.currentBook.id, false);
      }
    } catch (err) {
      console.log(err);
      this.setState({ errorMsg: err });
    }
  };
  addNewBook = async (title: string, desc: string): Promise<void> => {
    try {
      let response = await Axios.post(`${bookCollectionURL}`, {
        name: title,
        description: desc
      });
      await this.fetch();
    } catch (err) {
      console.log(err);
      this.setState({ errorMsg: err });
    }
  };
  updateBook = async (title: string, desc: string): Promise<void> => {
    try {
      if (this.state.currentBook) {
        let response = await Axios.patch(
          `${bookCollectionURL}${this.state.currentBook.id}/`,
          {
            name: title,
            description: desc
          }
        );
        await this.fetchBookDetail(this.state.currentBook.id, false);
      }
    } catch (err) {
      console.log(err);
      this.setState({ errorMsg: err });
    }
  };
  deleteBook = async (book: BookCollection): Promise<void> => {
    try {
      let response = await Axios.delete(`${bookCollectionURL}/${book.id}/`);
      await this.fetch();
    } catch (err) {
      console.log(err);
      this.setState({ errorMsg: err });
    }
  };

  render() {
    return (
      <BookContext.Provider value={this.state}>
        {this.props.children}
      </BookContext.Provider>
    );
  }
}

//@ts-ignore
const context: BookContext = {};

export const BookContext = React.createContext(context);
