import Button from "./Button";


const Header = () => {

    return (
        <div className="row py-3">
            <div className="col">
                <h1 className="text-white">Green room</h1>
            </div>
            <div className="col-auto">
                <Button 
                    text="Alle rom"
                    type="light border-primary"
                />
            </div>
        </div>

    )
}

export default Header;