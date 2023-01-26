import { Stack } from "@mui/system";
import FAQComponent from "../../components/faq";

export default function About() {
    return (
        <div id="about" style={{ width: "100%" }}>
            <h1 style={{ textAlign: "center" }}>About & FAQ</h1>
            <Stack direction="column" style={{ padding: "1vw" }}>
                <FAQComponent
                    question="About"
                    answer="This is a TypeRacer clone created by AJR07."
                />
                <FAQComponent
                    question="What is this made with?"
                    answer="This is made with the following frameworks: React, Typescript, Firebase, Framer-Motion, React-Router and Material-UI. This is hosted on Firebase Hosting and makes use of the Firestorm and Realtime Database as the primary databases."
                />
                <FAQComponent
                    question="What are the goals?"
                    answer="The goal of this project is to include the following: Authentication, Statistics for users (during game and in general), Single-player (where you can practice against your best WPM), Multi-player (where you can practice against other users).
          The concepts required to accomplish this task is primarily animation, routing, authentication, database management, and state management. In particular, database management for multiplayer apps is new to me. :D"
                />
                <FAQComponent
                    question="What is the work schedule?"
                    answer="The work schedule is as follows:
          1. T4W4 Tuesday Authentication (Firebase) 2. T4W4 Wednesday Single-player (Animation) 3. T4W4 Friday Multi-player (Firebase) 4. T4W4 Sunday Statistics (Firebase) 5. T4W4 Sunday Styling (Material-UI)"
                />
                <FAQComponent
                    question="What was the inspiration?"
                    answer="This is made as a submission for the Y4 CEP WA1. The inspiration was primarily from the website https://play.typeracer.com/, as well as the website https://monkeytype.com/."
                />
            </Stack>
            <h1 style={{ textAlign: "center" }}>Development Log</h1>
            <Stack direction="column" style={{ padding: "1vw" }}>
                <FAQComponent
                    question="24 January"
                    answer="Fully functional authentication system, displaying statistics and other account details :D. This includes Sign Up, Sign In, and Logout as well as storing of user information in Firestorm and displaying it"
                />
                <FAQComponent
                    question="25 January"
                    answer="The singleplayer page kind of works, I have added the starting sequence, and how the process is gonna work when I generate quotes. Need to find a library to generate the quotes better, and also need to figure out the end screen :D. Other than that, the page is pretty much done and I am on track-ish."
                />
                <FAQComponent
                    question="26 January"
                    answer="Didn't actually have enough time to complete much today, it was mainly just deciding on a charting library, modifying the UI for the typeracer singleplayer :("
                />
            </Stack>
        </div>
    );
}
