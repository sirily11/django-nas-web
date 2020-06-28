import Axios from 'axios';
import { fileContentURL } from './urls';
import { PaginationResponse, File as NasFile, Folder } from './interfaces/Folder';
export class FileContentManager {

    /**
     * Get file content by id
     * @param file File url
     */
    static async getContent(file: string): Promise<any> {
        let response = await Axios.get(file)
        return response.data
    }

    static async createFileWithName(name: String, parent: Folder): Promise<NasFile> {
        let response = await Axios.post<NasFile>(`${fileContentURL}/`, { filename: name, parent: parent?.id, })

        return response.data;
    }

    static async updateFileContent(id: number, content: string): Promise<NasFile> {
        let response = await Axios.patch(`${fileContentURL}/${id}/`, {})
        return response.data
    }
}