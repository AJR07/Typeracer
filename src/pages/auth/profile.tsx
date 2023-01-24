import { getAuth, User } from "firebase/auth";
import firebaseApp from "../../lib/firebase";

const auth = getAuth(firebaseApp);

interface ProfileProps {
    user: User;
}

export default function Profile(props: ProfileProps) {
    return (
        <div>
            <h1>Profile of {props.user.displayName}</h1>
        </div>
    );
}
