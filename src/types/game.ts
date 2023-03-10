import Character from "./character";

export default interface Game {
    id: string;
    hostID: string;
    stages: number;
    quote: string;
    countdown: number;
    playerData: { [id: string]: PlayerData };
}

export interface PlayerData {
    name: string;
    progress: number;
    wrongKeys: number;
    totalKeys: number;
    arr: Character[];
}
