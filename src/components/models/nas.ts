import Axios from "axios"
import { Folder, Parent, File as NasFile, Document as NasDocument } from './Folder';
import { number } from "@lingui/core";
import { OutputData } from "@editorjs/editorjs";
import { systemURL, url, documentURL, fileURL, searchFileURL } from "./urls"
import { DeltaStatic } from "quill";
import { Sidebar } from 'semantic-ui-react';



type UploadProgressCallback = (index: number, progress: number) => void


export class Nas {
    menus: Parent[]
    currentFolder?: Folder
    searchedFiles: NasFile[];
    errorMsg?: string


    constructor() {
        this.menus = []
        this.searchedFiles = [];
    }

    moveFileTo = async (fileId: number, dest: number) => {
        try {
            if (this.currentFolder) {
                let url = `${fileURL}${fileId}/`
                let response = await Axios.patch(url, { "parent": dest })
                await this.getContent(this.currentFolder.id)
            }

        } catch (err) {
            this.errorMsg = err;
        }
    }

    moveFolderTo = async (folderId: number, dest: number) => {
        try {
            if (this.currentFolder) {
                let u = `${url}${folderId}/`
                let response = await Axios.patch(u, { "parent": dest })
                await this.getContent(this.currentFolder.id)
            }

        } catch (err) {
            this.errorMsg = err;
        }
    }

    /**
     * Rename file
     */
    rename = async (fileId: number, newName: string) => {
        try {
            if (this.currentFolder) {
                let url = `${fileURL}${fileId}/`
                let response = await Axios.patch(url, { "filename": newName })
                await this.getContent(this.currentFolder.id)
            }

        } catch (err) {
            this.errorMsg = err;
        }
    }

    search = async (keyword: String) => {
        try {
            let url = `${searchFileURL}${keyword}`
            let response = await Axios.get<NasFile[]>(url);
            this.searchedFiles = response.data;
        } catch (err) {
            this.errorMsg = err
        }
    }

    getContent = async (id?: number | string) => {
        try {
            let u = id ? `${url}${id}/` : url
            let response = await Axios.get<Folder>(u)
            const { data } = response
            this.menus = data.parents
            this.currentFolder = data
            this.errorMsg = undefined
        } catch (err) {
            this.errorMsg = err
            this.currentFolder = undefined
        }
    }

    /**
     * Upload file to server.
     * If upload fail, will show alert dialog
     * @param files: List of files
     * @param onUpload: callback function
     */
    uploadFile = async (files: File[], onUpload: (index: number, progress: number, current: number, total: number) => void) => {
        try {

            let index = 0;
            for (let f of files) {
                if (this.currentFolder) {
                    onUpload(index, 0, 0, f.size);
                    let formData = new FormData()
                    formData.append("file", f)
                    this.currentFolder.id && formData.append("parent", this.currentFolder.id.toString())
                    let res = await Axios.post<NasFile>(fileURL, formData,
                        {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            // eslint-disable-next-line no-loop-func
                            onUploadProgress: (progress) => {
                                let p = Math.round((progress.loaded * 100) / progress.total);
                                onUpload(index, p, f.size * progress.loaded, progress.total)

                            }

                        })
                    this.currentFolder.files.push(res.data)
                    this.currentFolder.total_size += res.data.size


                }
                index += 1
            }
            onUpload(index, 100, 0, 0);
        } catch (err) {
            alert("Upload Failed: " + err.toString())
        }
    }

    deleteFile = async (id: number) => {
        try {
            let confirm = window.confirm("Are you sure you want to delete this file?")
            if (confirm && this.currentFolder) {
                let res = await Axios.delete<Nas>(`${fileURL}${id}/`)
                await this.getContent(this.currentFolder.id)
            }
        } catch (err) {
            alert("Upload Failed: " + err.toString())
        }
    }

    deleteFolder = async (id: number) => {
        try {
            let confirm = window.confirm("Are you sure you want to delete this folder?")
            if (confirm && this.currentFolder) {
                let res = await Axios.delete<Nas>(`${url}${id}/`)
                await this.getContent(this.currentFolder.id)
            }
        } catch (err) {
            alert("Upload Failed: " + err.toString())
        }
    }

    createNewFolder = async (data: any) => {
        if (this.currentFolder) {
            let res = await Axios.post<Folder>(url, { ...data, parent: this.currentFolder.id ? this.currentFolder.id : null })
            this.currentFolder.folders.push(res.data)
        } else {
            alert("Create new folder error: empty parent folder")
        }
    }

    renameFolder = async (id: number, newName: string) => {
        if (this.currentFolder) {
            let res = await Axios.patch<Folder>(`${url}${id}/`, { "name": newName })
            let index = this.currentFolder.folders.findIndex((f) => f.id === id)
            if (index > -1) {
                this.currentFolder.folders[index] = res.data
            }
        } else {
            alert("Rename new folder error: empty parent folder")
        }
    }

    /**
     * Get document from server.
     * We need this function because we are getting abstract document object from server
     * at begining(Which doesn't include content field).
     * 
     * We will Call this function when user want to edit the file
     */
    getDocument = async (id: string | number) => {

        let res = await Axios.get<NasDocument>(`${documentURL}${id}/`)
        /// Need to parse the content into js object
        return Promise.resolve({ ...res.data, content: JSON.parse(res.data.content) })

    }

    /**
     * Create new document
     * @param name: Name of the document
     * @param data: EditorJS object
     */
    createNewDocument = async (name: string, data: DeltaStatic) => {
        let res = await Axios.
            post<NasDocument>(documentURL,
                {
                    name: name, parent: this.currentFolder && this.currentFolder.id ? this.currentFolder.id : null,
                    content: JSON.stringify(data.ops)
                })
        this.currentFolder && this.currentFolder.documents.push(res.data)

    }

    /**
     * Update Document
     * @param id: document's id
     * @param data: EditorJS object
     */
    updateDocument = async (id: number, name: string, data: DeltaStatic) => {

        let res = await Axios.patch<NasDocument>(`${documentURL}${id}/`, { name, content: JSON.stringify(data.ops) })
        if (this.currentFolder) {
            let index = this.currentFolder.documents.findIndex((f) => f.id === id)
            if (index > -1) {
                this.currentFolder.documents[index] = res.data
            }

        }

    }

    /**
     * Delete document by id
     * 
     * @param id: document's id
     */
    deleteDocument = async (id: number) => {
        if (this.currentFolder) {
            let confirm = window.confirm("Do you want to delete this document?")
            if (confirm) {
                let res = await Axios.delete<NasDocument>(`${documentURL}${id}/`)
                await this.getContent(this.currentFolder.id)
                return Promise.resolve(res.data)
            } else {

            }

        } else {
            alert("Create new folder error: empty parent folder")
            return Promise.reject()
        }
    }

}
