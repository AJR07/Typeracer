/**
 * Stores the data of the user in the long term
 *
 * @export
 * @interface UserData
 * @typedef {UserData}
 */
export interface UserData {
    /**
     * Stores the name of the user
     *
     * @type {string}
     */
    name: string;
    /**
     * Stores the associated email of the user
     *
     * @type {string}
     */
    email: string;
    /**
     * Stores the UID of the user (generated by firebase)
     *
     * @type {string}
     */
    uid: string;
    /**
     * Stores the creationDate of the user's account
     *
     * @type {Date}
     */
    creationDate: Date;
    /**
     * Stores the WPM of the user in each game
     *
     * @type {number[]}
     */
    averageWPM: number[];
    /**
     * Stores the accuracy of the user in each game
     *
     * @type {number[]}
     */
    averageAccuracy: number[];
    /**
     * Stores the number of games played by the user
     *
     * @type {number}
     */
    numberOfGamesPlayed: number;
}

/**
 * Same as UserData, but with the creationDate as a firebase timestamp
 * This is used when receiving data from the database
 *
 * @export
 * @interface UserDataReceive
 * @typedef {UserDataReceive}
 */
export interface UserDataReceive {
    /**
     * Stores the name of the user
     *
     * @type {string}
     */
    name: string;
    /**
     * Stores the associated email of the user
     *
     * @type {string}
     */
    email: string;
    /**
     * Stores the UID of the user (generated by firebase)
     *
     * @type {string}
     */
    uid: string;
    /**
     * Stores the creationDate of the user's account (in firebase timestamp format)
     *
     * @type {{ seconds: number; nanoseconds: number }}
     */
    creationDate: { seconds: number; nanoseconds: number };
    /**
     * Stores the WPM of the user in each game
     *
     * @type {number[]}
     */
    averageWPM: number[];
    /**
     * Stores the accuracy of the user in each game
     *
     * @type {number[]}
     */
    averageAccuracy: number[];
    /**
     * Stores the number of games played by the user
     *
     * @type {number}
     */
    numberOfGamesPlayed: number;
}
