// Request DTOs
export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

// Response DTOs
export interface AuthResponseDTO {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar_url?: string;
    };
    token: string;
}

export interface UserProfileDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
    bio?: string;
    created_at: string;
}
