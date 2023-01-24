import { initializeApp } from "firebase/app";

let firebaseApp = initializeApp(await import("../serviceAccountKey.json"));
export default firebaseApp;
