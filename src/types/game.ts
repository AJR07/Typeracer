export default interface Game {
    id: string;
    hostID: string;
    started: boolean;
    ended: boolean;
    playerData: {
        [id: string]: {
            progress: number;
            accuracy: number;
        };
    };
}
