export interface BookCollection {
    id: number;
    name: string;
    description: string;
    created_time: Date;
    documents?: Document[]
}


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
    description?: string;
    user: User;
    size: number;
    modified_at: Date;
    file: string;
    object_type: string;
    transcode_filepath: string;
    filename: string;
    cover: string;
    music_metadata?: MusicMetadata
    file_content?: string
    image_metadata?: ImageMetaData
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
    collection: number;
    book_collection: BookCollection;
    show_in_folder: boolean;
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

export interface ImageMetaData {
    file: number;
    data: Data;
}

export interface Data {
    flash: number;
    model: string;
    datetime: string;
    f_number: number;
    has_exif: boolean;
    software: string;
    gps_speed: number;
    lens_make: string;
    lens_model: string;
    focal_length: number;
    gps_altitude: number;
    gps_latitude: number[];
    subject_area: number[];
    x_resolution: number;
    y_resolution: number;
    exposure_time: number;
    gps_longitude: number[];
    gps_speed_ref: string;
    metering_mode: number;
    white_balance: number;
    aperture_value: number;
    resolution_unit: number;
    brightness_value: number;
    gps_altitude_ref: number;
    gps_dest_bearing: number;
    gps_latitude_ref: string;
    gps_img_direction: number;
    gps_longitude_ref: string;
    pixel_x_dimension: number;
    pixel_y_dimension: number;
    lens_specification: number[];
    scene_capture_type: number;
    exposure_bias_value: number;
    shutter_speed_value: number;
    gps_dest_bearing_ref: string;
    subsec_time_original?: string;
    gps_img_direction_ref: string;
    subsec_time_digitized: string;
    gps_horizontal_positioning_error: number;
}
