import Navigation from "./Navigation";
import { useAuthContext } from "./provider/AuthProvider";
import Login from "./screens/Login";

const Auth = () => {
    const { user } = useAuthContext();

    if (!user) {
        return <Login />
    }

    return (
        <Navigation />
    )
}

export default Auth;