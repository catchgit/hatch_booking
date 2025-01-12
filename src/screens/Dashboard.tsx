import { useAuthContext } from "../providers/AuthProvider"


const Dashboard = () => {
    const { currentUser } = useAuthContext();

    return (
        <div className="container">
            <h1>Dashboard</h1>
            {JSON.stringify(currentUser)}
        </div>
    )
}

export default Dashboard