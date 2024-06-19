import { Link } from 'react-router-dom';
import ConnectButton from "../components/others/ConnectButton";

interface NavbarProps {
    onWalletConnected: (address: string) => void;
  }

const Navbar: React.FC<NavbarProps> = ({ onWalletConnected }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/">Mi Proyecto</Link>
        </div>
        <div className="flex space-x-4">
          <ConnectButton onWalletConnected={onWalletConnected} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;