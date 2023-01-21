import { Stack } from "@mui/system";
import FAQComponent from "../../components/faq";

export default function About() {
  return (
    <div id="about">
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
          answer="The goal of this project is to include the following: Authentication, Statistics for users (during game and in general), Single-player (where you can practice against your best WPM), Multi-player (where you can practice against other users), and a Leaderboard (where you can see the top 10 users)."
        />
        <FAQComponent
          question="What was the inspiration?"
          answer="This is made as a submission for the Y4 CEP WA1."
        />
      </Stack>
    </div>
  );
}
