import React from "react";
import { Link } from "react-router-dom";
import ConnectButton from "../components/others/ConnectButton";
import { NavbarProps } from "../types/index";

const Navbar: React.FC<NavbarProps> = ({ onWalletConnected }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white font-bold space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/zero-knowledge" className="hover:text-gray-300">ZeroKnowledge Proofs</Link>
        </div>
        <div className="text-right">
          <ConnectButton onWalletConnected={onWalletConnected} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;