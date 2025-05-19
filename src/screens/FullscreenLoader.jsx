import { ClipLoader } from "react-spinners";

export const FullscreenLoader = ({ theme = "light", fullscreen = true }) => (
    <section className={`${theme === "dark" ? "main-section" : ""} ${fullscreen ? "vh-100" : "custom-vh-90"}`}>
        <div className="d-flex align-items-center justify-content-center h-100">
            <ClipLoader size={100} color={theme === "dark" ? "white" : "black"} />
        </div>
    </section>
)