export interface User {
    isLoggedIn: boolean;
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
}

export interface UserAction {
    type: string;
    userSet: User | null;
}