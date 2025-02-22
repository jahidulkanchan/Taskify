import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MdOutlineLogout, MdClose } from "react-icons/md";
import logoIcon from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading, signOutUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    setShowMenu(false);
  }, [user]);

  const handleSignOut = () => {
    signOutUser();
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <header className="fixed w-full top-0 left-0 z-20 bg-white/70 backdrop-blur-md shadow-md px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logoIcon} alt="Taskify" className="h-10 mr-2" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Taskify
          </h3>
        </Link>

        {/* User Authentication */}
        <div className="relative flex items-center gap-5">
          {user ? (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full overflow-hidden border">
                <img src={user?.photoURL} alt="User" className="w-full h-full object-cover" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <img src={user?.photoURL} alt="User" className="w-12 h-12 rounded-full border" />
                      <p className="text-sm font-medium">{user?.displayName}</p>
                    </div>
                    <button onClick={() => setShowMenu(false)} className="text-gray-600 hover:text-gray-900">
                      <MdClose size={20} />
                    </button>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-2 mt-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition"
                  >
                    Log Out <MdOutlineLogout />
                  </button>
                </div>
              )}
            </div>
          ) : (
            !loading && (
              <Link to="/login" className="px-4 pt-1 pb-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-md hover:opacity-80 transition">
                Log In
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;