export interface UserData {
    name: string;
    email: string;
    uid: string;
    creationDate: Date;
    averageWPM: number[];
    averageAccuracy: number[];
    numberOfGamesPlayed: number;
}

export interface UserDataReceive {
    name: string;
    email: string;
    uid: string;
    creationDate: { seconds: number; nanoseconds: number };
    averageWPM: number[];
    averageAccuracy: number[];
    numberOfGamesPlayed: number;
}
