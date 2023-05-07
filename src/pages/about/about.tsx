import { Stack } from "@mui/system";
import FAQComponent from "../../components/faq";

/**
 * THe about page that displays the project details and the development details
 *
 * @export
 * @returns {*}
 */
export default function About() {
    // each FAQComponent is a dropdown that displays the title and the answer/elaboration
    // it is split to several sections
    return (
        <div id="about" style={{ width: "100%" }}>
            <h1 style={{ textAlign: "center" }}>Project Details</h1>
            <Stack direction="column" style={{ padding: "1vw" }}>
                <FAQComponent
                    question="Codebase"
                    answer="Open Source, hosted on Github: https://github.com/AJR07/Typeracer"
                />
                <FAQComponent
                    question="Development Phase"
                    answer="24 January - 14 March 2023"
                />
            </Stack>
            <h1 style={{ textAlign: "center" }}>
                About & Project Development Details
            </h1>
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
          The concepts required to accomplish this task is primarily animation, routing, authentication, realtime database management, and state management. In particular, realtime database management for multiplayer apps is new to me. :D I envision it to be a game where you can practice your typing skills, and also compete against other users easily."
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
                <FAQComponent
                    question="28 January"
                    answer="Singleplayer is done! Learnt how to represent statistics with graphs, and the singleplayer page is fully functional! I have also saved the data to firebase for future use/statistics :D"
                />
                <FAQComponent
                    question="31 January"
                    answer="Quite a lot of progress actually. I have enhanced the UI on the start button, graph (added accuracy), and the typeracer text and background. The colours, at leat in my opinion, look a lot more contrasting and calmer to look at too. The graph at the back also received major improvements, as well as bug fixes towards cheats such as using shortcuts. I have also added a timer for the user to check their current time/schedule. SINGLEPLAYER IS DONE!"
                />
                <FAQComponent
                    question="13/14 February"
                    answer="Added functionality for multiplayer, specifically joining of games and game IDs, as well as how every participant will deal with the game. We are able to track each game's data in realtime. Next up, the actual game!"
                />
                <FAQComponent
                    question="23 February"
                    answer="Completed syncing for a multiplayer game. I have also added progress bars for everyone to track each other's progress, and the game successfully reaches the end screen now. I have also resolved many issues regarding the race conditions :D"
                />
                <FAQComponent
                    question="24 February"
                    answer="MULTIPLAYER DONE! (At least the bare-bones). Race conditions has been resolved, and issues regarding the quotes and author names resulted in me removing them from the quotes!"
                />
                <FAQComponent
                    question="2 March"
                    answer="Bug fixes... performance improvements! 1. Profile Graph added, profile page tidied. 2. Singleplayer - Loading quote notification, removing calculation of characters per minute, and following standard 1 word = 5 characters calculation for WPM, hiding of text box and persistent selection of text box, adding wrong sentence that was typed as 'red', tidying up of home screen, and UI improvements. Press 'TAB' to reload new game!"
                />
                <FAQComponent
                    question="7 March"
                    answer="Bug fixes for singleplayer. For multiplayer, added the ability to publicly view games, improved collaboration when playing together, and significantly improved and updated the end screen for multiplayer! Lets Go, I think we are done!"
                />
                <FAQComponent
                    question="8 March"
                    answer="Most major issues have been addressed, including UI issues. A home page has been added, with bubbles! The icons at the side has been changed to reflect the actual page. Graphs have been split into 2 when I saw fit, so that its not a clunked mess. It's basically done :D"
                />
                <FAQComponent
                    question="7 May"
                    answer="Updated Sound Design. I decided to make it very minimal, no one wants sounds to be playing as you click buttons etc. Therefore, sounds will only play when you are typing in multiplayer and singlelplayer, just like for other websites :D"
                />
            </Stack>
            <h1 style={{ textAlign: "center" }}>Final Writeup</h1>
            <Stack direction="column" style={{ padding: "1vw" }}>
                <FAQComponent
                    question="Link to codebase:"
                    answer="https://github.com/AJR07/Typeracer"
                />
                <FAQComponent
                    question="Link to this website:"
                    answer="(In case you somehow couldn't find it) https://typeracer-ajr07.web.app/"
                />
                <FAQComponent
                    question="What challenges did I meet?"
                    answer="There were many issues that I encountered when constructing the multiplayer. Many of them were due to race-conditions (something that happens when two devices send updates at the same time, and one overwrites another even though they didn't mean to). Furthermore, I was trying to implement the app's logic only on the client-side as a challenge, and that meant I could not solve this directly from firebase itself. This means I had to add a bunch of logic in the uploading of data to make sure things didn't override each other. I also encountered another issue when updating of the data in each client's devices was scuffed. For example, if someone would type a character, it would upload it to the server, and redownload it back to the client's computer. By that time, the client might have typed 1 more character, but that would be erased. There was some logic needed to be added to fix that. Most of the challenges was definitely in the statistics tracking and display, and multiplayer part of the app."
                />
                <FAQComponent
                    question="What am I proud of?"
                    answer="I have finally managed to do multiplayer! I tried it a few times with other apps such as Chess App, but my code became way too complicated. This time I actually planned out how I wanted to do things and was able to pull it off, and produced something fairly reliable! Lets go! :D I am also proud of the fact I was able to make a fairly simple authentication system, that was able to reliable track all of the user's statistics and wasn't too invasive. (At least that's what I think)"
                />
                <FAQComponent
                    question="What would I do differently/Future works?"
                    answer="I think I would have preferred if I went for a more unqiue clone/idea, rather than going for the same typeracer that is everywhere on the internet. For example, I could try to gamify this whole thing with words flying about. However, I didn't end up doing that, and it could be future work I guess. Either way, I think this project is more or less done as it is, the few things I could add include: 1. Racing against your personal score, 2. Custom words, 3. Custom themes, 4. Include other customisations added in monkeytype. Other than that, I am quite satisfied with the current product :D"
                />
            </Stack>
        </div>
    );
}
