import Navigation from "./Navigation";
import { useAuthContext } from "./providers/AuthProvider";


const Auth = () => {
    const { currentUser } = useAuthContext();

    if (!currentUser) {
        return (
            <p>Du må logge inn!</p>
        )
    }

    return (
        <Navigation />
    )
}

export default Auth;