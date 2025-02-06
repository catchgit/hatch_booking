import Navigation from "./Navigation";
import { useAuthContext } from "./provider/AuthProvider";
import Login from "./screens/Login";
import Calendar from "./screens/Calendar";

const Auth = () => {
    const { user } = useAuthContext();

    if (!user) {
        return <Calendar />
    }

    return (
        <Navigation />
    )
}

export default Auth;