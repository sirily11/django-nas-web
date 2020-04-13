export interface MusicMetadata {
    id: number;
    title: string;
    album: string;
    artist: string;
    year: string;
    genre: string;
    track: number;
    picture: string
    duration: number;
    file: number;
    like: boolean
}

export interface PaginationResponse<T> {
    next: string | null;
    previous: string | null;
    count: number;
    total_pages: number;
    current_page: number;
    results: T[]
}

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
    transcode_filepath: string;
    filename: string;
    cover: string;
    music_metadata?: MusicMetadata
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
    parent: undefined | null | string | number;
    content: any
}

export interface SystemInfo {
    cpu: number;
    disk: Info;
    memory: Info;
    temperature?: number;
    humidity?: number;
    pressure?: number;
}

export interface Info {
    used: number;
    total: number;
}