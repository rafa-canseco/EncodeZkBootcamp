import ConnectButton from "../components/others/ConnectButton";

interface NavbarProps {
    onWalletConnected: (address: string) => void;
  }

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