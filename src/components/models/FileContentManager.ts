import Axios from 'axios';
import { fileContentURL, fileURL } from './urls';
import { PaginationResponse, File as NasFile, Folder } from './interfaces/Folder';
export class FileContentManager {

    static async getFile(fileId: string): Promise<NasFile> {
        let response = await Axios.get<NasFile>(`${fileURL}${fileId}`);
        return response.data;
    }

    /**
     * Get file content by id
     * @param file File id
     */
    static async getContentById(fileId: string): Promise<NasFile> {
        let response = await Axios.get(`${fileContentURL}${fileId}`);
        return response.data;
    }

    /**
 * Get file content
 * @param file File url
 */
    static async getContent(fileId: string): Promise<any> {
        let response = await Axios.get(`${fileId}`);
        return response.data;
    }


    static async createFileWithName(name: String, parent: Folder): Promise<NasFile> {
        let response = await Axios.post<NasFile>(`${fileContentURL}/`, { filename: name, parent: parent?.id, });

        return response.data;
    }

    static async updateFileContent(id: number, content: string): Promise<NasFile> {
        let response = await Axios.patch(`${fileContentURL}${id}/`, { file_content: content });
        return response.data;
    }
}