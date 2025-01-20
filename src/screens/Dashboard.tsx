import Button from "../components/Button";
import { useAuthContext } from "../providers/AuthProvider"


const Dashboard = () => {
    const { signOut } = useAuthContext();

    return (
        <div className="container">
            <h1>Dashboard</h1>
            <Button
                text="logg ut"
                onClick={signOut}
            />
        </div>
    )
}

export default Dashboard