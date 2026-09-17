import { LogOut, Radio, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <header className="app-navbar">
      <div className="brand-lockup">
        <span className="brand-mark">
          <Radio size={18} />
        </span>
        <span>Nuzio AI</span>
      </div>

      <div className="nav-user">
        <span className="nav-pill">
          <Sparkles size={15} />
          {user?.interests?.slice(0, 3).join(" / ")}
        </span>
        <button className="icon-button" type="button" onClick={logout} aria-label="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
