import { Outlet, useNavigate } from "react-router-dom";



export default function Header() {
    const nav = useNavigate();
    return (<div className="app-layout">
        <header className="headerContainer">
            {/* Left side */}
            <div className="headerText">
                Army Helper
            </div>

            {/* Right side */}
            <nav className="headerButtonContainer">
                <button onClick={() => nav("/")}>Units</button>
                <button onClick={() => nav("/abilities")}>Abilities</button>
                <button onClick={() => alert('Function not complete!')}>Stratagems</button>
            </nav>
        </header>
        <Outlet />
    </div>
    );
}
