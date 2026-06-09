import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import BankButton from "./BankButton";
import pp from "../assets/account.svg";
import logo from "../assets/favicon.png";

const Header = () => {
  const { user, logout, isLoading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
  }

  return (
    <div className="fixed h-24 top-0 left-0 right-0 z-50 bg-primary-600 border-b border-primary-700 shadow-sm px-6 py-3 flex items-center justify-between">
      <h1 className="text-text-light font-semibold text-3xl flex">
        <Link
          to="/"
          className="flex items-center text-text-light hover:opacity-80 transition-opacity"
        >
          <img src={logo} className="h-8 mr-2 my-0.5" />
          Värderingskollen
        </Link>
      </h1>

      {isLoading ? null : user ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-text-light px-4 py-2 rounded-lg transition-colors"
          >
            <img src={pp} className="w-6 h-6" />
            <span className="font-medium">{user.givenName}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden animate-[slideUp_0.15s_ease]">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-text hover:bg-neutral-50 transition-colors"
              >
                Min profil
              </Link>
              <hr className="border-border" />
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
              >
                Logga ut
              </button>
            </div>
          )}
        </div>
      ) : (
        <BankButton />
      )}
    </div>
  );
};

export default Header;
