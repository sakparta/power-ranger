import React from "react";
import { Link } from "react-router-dom";  // Import Link for navigation
const clanName = "POWER❤️RANGER"
const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white p-4 ">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold">
          {clanName}
        </Link>
        <div>
          <Link
            to="/previous-wars"
            className="px-4 py-2 text-lg rounded-md"
          >
            Previous Wars
          </Link>
          <Link
            to="/current-war"
            className="px-4 py-2 text-lg rounded-md"
          >
            Current War
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;