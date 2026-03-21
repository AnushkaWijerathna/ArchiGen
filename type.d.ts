//Interface AuthState is a TypeScript interface that defines the structure (shape) of an object.
interface AuthState {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null;
}

//AuthContext = user info + buttons (login/logout) 🎮
type AuthContext = {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null;
    refreshAuth: () => Promise<boolean>;
    signIn: () => Promise<boolean>;
    signOut: () => Promise<boolean>;
}