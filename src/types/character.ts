/**
 * Typing for how each character, when its typed in mutiplayer/singleplayer, is stored as data in the database
 *
 * @export
 * @interface Character
 * @typedef {Character}
 */
export default interface Character {
    /**
     * The time when this character was typed
     *
     * @type {number}
     */
    time: number;
    /**
     * Accuracy of the user after typing this character
     *
     * @type {number}
     */
    acc: number;
    /**
     * The character that was typed - Could contain more than one character, depending on when the website registered
     *
     * @type {string}
     */
    character: string;
}
