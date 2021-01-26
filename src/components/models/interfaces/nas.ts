import Axios from "axios";
import { Folder, Parent, File as NasFile, Document as NasDocument, PaginationResponse } from './Folder';

import { url, documentURL, fileURL, searchFileURL, musicURL, updateFileURL } from "../urls";
import { DeltaStatic } from "quill";
import * as path from 'path';



type UploadProgressCallback = (index: number, progress: number) => void;


export class Nas {
    menus: Parent[];
    currentFolder?: Folder;
    searchedFiles: NasFile[];
    errorMsg?: string;


    constructor() {
        this.menus = [];
        this.searchedFiles = [];
    }

    moveFileTo = async (fileId: number, dest: number | null) => {
        try {
            if (this.currentFolder) {
                let url = `${fileURL}${fileId}/`;
                await Axios.patch(url, { "parent": dest });
                await this.getContent(this.currentFolder.id);
            }

        } catch (err) {
            this.errorMsg = err;
        }
    };

    /**
     * Fetch list of music
     */
    fetchMusicList = async (): Promise<PaginationResponse<NasFile> | undefined> => {
        try {

            let url = `${musicURL}`;
            let data = await Axios.get<PaginationResponse<NasFile>>(url);
            return data.data;
        } catch (err) {
            console.log("err");
            this.errorMsg = err;
        }
    };

    moveDocument = async (documentId: number, dest: number | null) => {
        try {
            if (this.currentFolder) {
                let url = `${documentURL}${documentId}/`;
                await Axios.patch(url, { "parent": dest });
                await this.getContent(this.currentFolder.id);
            }

        } catch (err) {
            this.errorMsg = err;
        }
    };

    moveFolderTo = async (folderId: number, dest: number | null) => {
        try {
            if (this.currentFolder) {
                let u = `${url}${folderId}/`;
                await Axios.patch(u, { "parent": dest });
                await this.getContent(this.currentFolder.id);
            }

        } catch (err) {
            this.errorMsg = err;
        }
    };

    /**
     * Rename file
     */
    rename = async (fileId: number, newName: string) => {
        try {
            if (this.currentFolder) {
                let url = `${fileURL}${fileId}/`;
                await Axios.patch(url, { "filename": newName });
                await this.getContent(this.currentFolder.id);
            }

        } catch (err) {
            console.log(err);
            this.errorMsg = err;
        }
    };

    /**
     * Search by keyword
     * @param keyword Keyword
     */
    search = async (keyword: String) => {
        try {
            let url = `${searchFileURL}${keyword}`;
            let response = await Axios.get<NasFile[]>(url);
            this.searchedFiles = response.data;
        } catch (err) {
            this.errorMsg = err;
        }
    };

    /**
     * Get content by id
     */
    getContent = async (id?: number | string) => {
        try {

            let u = id ? `${url}${id}/` : url;
            console.log(u);
            let response = await Axios.get<Folder>(u);
            const { data } = response;
            this.menus = data.parents;
            this.currentFolder = data;
            this.errorMsg = undefined;
        } catch (err) {
            this.errorMsg = err;
            this.currentFolder = undefined;
        }
    };

    updateFile = async (fileID: string, file: string) => {
        await Axios.post(updateFileURL + fileID, { "content": file });

    };


    /**
     * Upload file to server.
     * If upload fail, will show alert dialog
     * @param files: List of files
     * @param onUpload: callback function
     * @param isDir: Whether upload directory
     */
    uploadFile = async (files: File[], isDir: boolean, onUpload: (index: number, progress: number, current: number, total: number) => void, onFileUploaded: (file: File) => Promise<void>) => {
        try {
            let index = 0;
            for (let f of files) {
                if (this.currentFolder) {
                    onUpload(index, 0, 0, f.size);

                    let formData =
                        isDir ?
                            await this.getUploadFileAndCreateFolder(f) :
                            this.getSingleUploadFile(f);

                    await Axios.post<NasFile>(fileURL, formData,
                        {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            // eslint-disable-next-line no-loop-func
                            onUploadProgress: (progress) => {
                                let p = Math.round((progress.loaded * 100) / progress.total);
                                onUpload(index, p, f.size * progress.loaded, progress.total);

                            }

                        });

                    await this.getContent(this.currentFolder?.id);
                    await onFileUploaded(f);

                }
                index += 1;
            }
            onUpload(index, 100, 0, 0);
        } catch (err) {
            console.log(err);
            alert("Upload Failed: " + err.toString());
        }
    };

    /**
     * Only get the formdata but don't create folder
     * @param file File
     */
    getSingleUploadFile(file: File): FormData | undefined {
        if (this.currentFolder) {
            let formData = new FormData();
            formData.append("file", file);
            this.currentFolder.id && formData.append("parent", this.currentFolder.id.toString());
            return formData;
        }

    }

    /**
     * Create folder for file. And then return the file
     * For example file with path a/a.jpg will create a folder
     * @param file Upload file
     */
    async getUploadFileAndCreateFolder(file: File): Promise<FormData | undefined> {
        if (this.currentFolder) {
            //@ts-ignore
            let paths = file.webkitRelativePath;
            let formData = new FormData();
            console.log(this.currentFolder);
            formData.append("file", file);
            this.currentFolder.id && formData.append("parent", `${this.currentFolder?.id}`);
            formData.append("paths", paths);
            return formData;
        }

    }


    /**
     * Delete file
     */
    deleteFile = async (id: number, showAlert = true) => {
        try {

            let confirm = showAlert ? window.confirm("Are you sure you want to delete this file?") : true;
            if (confirm && this.currentFolder) {
                await Axios.delete<Nas>(`${fileURL}${id}/`);
                await this.getContent(this.currentFolder.id);
            }
        } catch (err) {
            alert("Upload Failed: " + err.toString());
        }
    };

    /**
     * Delete folder by id
     */
    deleteFolder = async (id: number) => {
        try {
            let confirm = window.confirm("Are you sure you want to delete this folder?");
            if (confirm && this.currentFolder) {
                await Axios.delete<Nas>(`${url}${id}/`);
                await this.getContent(this.currentFolder.id);
            }
        } catch (err) {
            alert("Upload Failed: " + err.toString());
        }
    };

    /**
     * Create folder with name
     * @param name
     */
    createNewFolder = async (name: string) => {
        if (this.currentFolder) {
            let res = await Axios.post<Folder>(url, { name: name, parent: this.currentFolder.id ? this.currentFolder.id : null });
            this.currentFolder.folders.push(res.data);
        } else {
            alert("Create new folder error: empty parent folder");
        }
    };

    /**
     * Rename the folder 
     * @param id folder id
     * @param newName new name
     */
    renameFolder = async (id: number, newName: string) => {
        if (this.currentFolder) {
            let res = await Axios.patch<Folder>(`${url}${id}/`, { "name": newName });
            let index = this.currentFolder.folders.findIndex((f) => f.id === id);
            if (index > -1) {
                this.currentFolder.folders[index] = res.data;
            }
        } else {
            alert("Rename new folder error: empty parent folder");
        }
    };


    /**
     * Rename the folder 
     * @param id folder id
     * @param newName new name
     */
    renameDocument = async (id: number, newName: string) => {
        if (this.currentFolder) {
            let res = await Axios.patch<NasDocument>(`${documentURL}${id}/`, { "name": newName });
            let index = this.currentFolder.documents.findIndex((f) => f.id === id);
            if (index > -1) {
                this.currentFolder.documents[index] = res.data;
            }
        } else {
            alert("Rename new document error");
        }
    };

    /**
     * Get document from server.
     * We need this function because we are getting abstract document object from server
     * at begining(Which doesn't include content field).
     * 
     * We will Call this function when user want to edit the file
     */
    getDocument = async (id: string | number): Promise<NasDocument> => {

        let res = await Axios.get<NasDocument>(`${documentURL}${id}/`);
        /// Need to parse the content into js object
        return Promise.resolve({ ...res.data, content: JSON.parse(res.data.content) });

    };

    /**
     * Create new document
     * @param name: Name of the document
     * @param data: EditorJS object
     */
    createNewDocument = async (name: string, data?: DeltaStatic, parent?: any) => {
        let res = await Axios.post<NasDocument>(documentURL,
            {
                name: name, parent: this.currentFolder && this.currentFolder.id ? this.currentFolder.id : parent,
                content: data ? JSON.stringify(data.ops) : undefined
            });
        this.currentFolder && this.currentFolder.documents.push(res.data);
        return res.data;
    };

    /**
     * Update Document
     * @param id: document's id
     * @param data: EditorJS object
     */
    updateDocument = async (id: number, name: string, data: DeltaStatic) => {

        let res = await Axios.patch<NasDocument>(`${documentURL}${id}/`, { name, content: JSON.stringify(data?.ops) });
        if (this.currentFolder) {
            let index = this.currentFolder.documents.findIndex((f) => f.id === id);
            if (index > -1) {
                this.currentFolder.documents[index] = res.data;
            }

        }

    };

    /**
     * Delete document by id
     * 
     * @param id: document's id
     */
    deleteDocument = async (id: number) => {
        if (this.currentFolder) {
            let confirm = window.confirm("Do you want to delete this document?");
            if (confirm) {
                let res = await Axios.delete<NasDocument>(`${documentURL}${id}/`);
                await this.getContent(this.currentFolder.id);
                return Promise.resolve(res.data);
            } else {

            }

        } else {
            alert("Create new folder error: empty parent folder");
            return Promise.reject();
        }
    };

}
