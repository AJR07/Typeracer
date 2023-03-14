import { Stack } from "@mui/system";
import Bubble from "../../components/bubbles";

export default function Home() {
    return (
        <div>
            <h1>TYPERACER - AJR07</h1>
            <Stack direction="row" spacing={5}>
                <Bubble
                    to="/singleplayer"
                    description="Want to enhance your typing skills? Try out singleplayer here!"
                    name="Singleplayer"
                />
                <Bubble
                    to="/multiplayer"
                    description="Play with your friends! Compete to finish typing the quotes the fastest, and analyse ur results at the end!"
                    name="Multiplayer"
                />
                <Bubble
                    to="/profile"
                    description="Create an account to track your stats! You can use any email you want, I don't really care lol."
                    name="Profile"
                />
                <Bubble
                    to="/about"
                    description="Find out the developmental process of this website."
                    name="About"
                />
            </Stack>
        </div>
    );
}
