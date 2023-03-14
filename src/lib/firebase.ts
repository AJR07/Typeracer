import { initializeApp } from "firebase/app";

/**
 * Importing the service account key to use as firebase credentials. The key
 * is not included in the repository, but can be obtained from the firebase
 * console. We initialise the firebase app with the service account key.
 *
 * @type {*}
 */
let firebaseApp = initializeApp(await import("../serviceAccountKey.json"));
export default firebaseApp;
