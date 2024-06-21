import React from "react";
import ConnectButton from "../components/others/ConnectButton";
import { NavbarProps } from "../types/index";

const Navbar: React.FC<NavbarProps> = ({ onWalletConnected }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="text-right text-white font-bold">
        <div className="space-x-4">
          <ConnectButton onWalletConnected={onWalletConnected} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
