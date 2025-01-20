import Navigation from "./Navigation";
import { useAuthContext } from "./providers/AuthProvider";
import Login from "./screens/Login";


const Auth = () => {
    const { currentUser } = useAuthContext();

    if (!currentUser) {
        return <Login />
    }

    return (
        <Navigation />
    )
}

export default Auth;