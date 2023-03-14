import { useState, useEffect } from "react";

/**
 * Timer component for the multiplayer and singleplayer typeracer to let the user know how long they have been typing for
 *
 * @export
 * @returns {*}
 */
export default function Timer() {
    const [seconds, setSeconds] = useState(0);

    // using a useEffect hook to update the seconds state every second
    useEffect(() => {
        // setting an interval so that the seconds state is updated every second
        const intervalId = setInterval(() => {
            setSeconds((seconds) => seconds + 1);
        }, 1000);
        // returning a function to clear the interval when the component is unmounted, to prevent memory leaks
        return () => clearInterval(intervalId);
    }, []);

    return <>{seconds}</>;
}
