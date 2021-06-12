export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}

export interface CRED {
    email: string;
    password: string;
}

export interface PROF_CRE {
    user_name: string;
    bio: string;
    avatar: File | null;
}

export interface JWT {
    refresh: string;
    access: string;
}


export interface POST_PROFILE {
    id: number;
    user_name: string;
    avatar?: File;
    bio: string;
}

export  interface NEWPOST {
    body: string;
    image?: File | null;
}

export interface LIKED {
    id: number;
    body: string;
    current: number[];
    new: number;
}

export interface COMMENT {
    body: string;
    post: number;
}

export interface POST {
    id: number;
    loginId: number;
    user_post: number;
    body: string;
    image?: string;
    liked: number[];
}
