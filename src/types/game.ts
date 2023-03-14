import Character from "./character";
import Stages from "./stages";

/**
 * Shows the structure of the game as it is stored inside the database (MULTIPLAYER)
 *
 * @export
 * @interface Game
 * @typedef {Game}
 */
export default interface Game {
    /**
     * The ID of the game
     *
     * @type {string}
     */
    id: string;
    /**
     * The ID of the host of the game
     *
     * @type {string}
     */
    hostID: string;
    /**
     * The stage at which this game is at - infers from an enum (see Stages)
     *
     * @type {Stages}
     */
    stages: Stages;
    /**
     * The quote that is being typed in this game
     *
     * @type {string}
     */
    quote: string;
    /**
     * The countdown as the game is being started
     *
     * @type {number}
     */
    countdown: number;
    /**
     * The data of all player, which is updated as they are typing the quote
     *
     * @type {{ [id: string]: PlayerData }}
     */
    playerData: { [id: string]: PlayerData };
}

/**
 * The data of each player, which is updated as they are typing the quote
 *
 * @export
 * @interface PlayerData
 * @typedef {PlayerData}
 */
export interface PlayerData {
    /**
     * The name of the current player (to be displayed)
     *
     * @type {string}
     */
    name: string;
    /**
     * The progress of the current player in terms of characters typed
     *
     * @type {number}
     */
    progress: number;
    /**
     * The number of wrong keys the player has typed
     *
     * @type {number}
     */
    wrongKeys: number;
    /**
     * The total number of keys the player has typed
     *
     * @type {number}
     */
    totalKeys: number;
    /**
     * Stores the data of each character typed by the player
     *
     * @type {Character[]}
     */
    arr: Character[];
}
