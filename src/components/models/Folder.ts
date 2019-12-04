export interface Folder {
    id: number;
    created_at: Date;
    name: string;
    parent?: number;
    description: null;
    user: null;
    modified_at: Date;
    files: File[];
    folders: Folder[];
    parents: Parent[];
    total_size: number;
    documents: Document[]
}

export interface File {
    id: number;
    created_at: Date;
    parent: number;
    description: null;
    user: User;
    size: number;
    modified_at: Date;
    file: string;
    object_type: string;
    filename: string;

}

export interface User {
    username: string;
    email: string;
}

export interface Parent {
    name: string;
    id: number;
}

export interface Document {
    id: number;
    created_at: Date;
    name: string;
    description: string;
    size: null;
    modified_at: Date;
    parent: null;
}