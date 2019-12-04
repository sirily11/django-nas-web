import Axios from "axios"
import { Folder, Parent, File as NasFile, Document as NasDocument } from './Folder';
import { number } from "@lingui/core";


const url = "http://127.0.0.1:8000/api/folder/"
const fileURL = "http://127.0.0.1:8000/api/file/"
const documentURL = "http://127.0.0.1:8000/api/document/"

type UploadProgressCallback = (index: number, progress: number) => void


export class Nas {
    menus: Parent[]
    currentFolder?: Folder
    errorMsg?: string

    constructor() {
        this.menus = []

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
    uploadFile = async (files: File[], onUpload: (index: number, progress: number) => void) => {
        try {

            let index = 0;
            for (let f of files) {
                if (this.currentFolder) {
                    onUpload(index, 0);
                    let formData = new FormData()
                    formData.append("file", f)
                    this.currentFolder.id && formData.append("parent", this.currentFolder.id.toString())
                    let res = await Axios.post<NasFile>(fileURL, formData,
                        {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            onUploadProgress: (progress) => {
                                let p = Math.round((progress.loaded * 100) / progress.total);
                                onUpload(index, p)

                            }

                        })
                    this.currentFolder.files.push(res.data)
                    this.currentFolder.total_size += res.data.size


                }
                index += 1
            }
            onUpload(index, 100);
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

    renameFolder = async (id: number, data: any) => {
        if (this.currentFolder) {
            let res = await Axios.patch<Folder>(`${url}${id}/`, { ...data, parent: this.currentFolder.id ? this.currentFolder.id : null })
            let index = this.currentFolder.folders.findIndex((f) => f.id === id)
            if (index > -1) {
                this.currentFolder.folders[index] = res.data
            }
        } else {
            alert("Rename new folder error: empty parent folder")
        }
    }

    getDocument = async (id: number) => {
        if (this.currentFolder) {
            let res = await Axios.get<NasDocument>(`${documentURL}${id}/`)
            return Promise.resolve(res.data)
        } else {
            alert("Create new folder error: empty parent folder")
            return Promise.reject()
        }
    }

    createNewDocument = async (name: string, data: any) => {
        if (this.currentFolder) {
            let res = await Axios.post<NasDocument>(url, { ...data, parent: this.currentFolder.id ? this.currentFolder.id : null })
            this.currentFolder.documents.push(res.data)
        } else {
            alert("Create new Document error: empty parent folder")
        }
    }

    updateDocument = async (id: number, data: any) => {
        if (this.currentFolder) {
            let res = await Axios.patch<Folder>(`${url}${id}/`, { ...data, parent: this.currentFolder.id ? this.currentFolder.id : null })
            let index = this.currentFolder.folders.findIndex((f) => f.id === id)
            if (index > -1) {
                this.currentFolder.folders[index] = res.data
            }
        } else {
            alert("Update new document error: empty parent folder")
        }
    }

}
