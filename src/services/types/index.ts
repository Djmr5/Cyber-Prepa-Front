export interface Play {
    id: number;
    ended: boolean;
    time: string;
    student: string;
    game: number | string;
}

export interface Game {
    id: number,
    plays: number | Play[],
    name: string,
    show: boolean,
    start_time: string,
    file_route: string,
}

export interface Student {
    id: string,
    name: string,
    played_today: number,
    weekly_plays: number,
    sanctions_number: number,
    forgoten_id: boolean,
}

export interface User {
    id: number,
    email: string,
    is_admin: boolean,
    theme: string,
    is_active: boolean,
}

export interface ApiResponse<T> {
    data: T[]
    status: number
}