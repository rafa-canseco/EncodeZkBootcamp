import { useEffect} from "react";
import useMetamask from "../../hooks/useMetamask";
import { Button } from "@/components/ui/button";

interface ConnectButtonProps {
    onWalletConnected: (walletAddress: string) => void;
  }
  
  const ConnectButton: React.FC<ConnectButtonProps> = ({ onWalletConnected }) => {
    const { connectMetamask, tryConnectingMetamask, signer, walletAddress } = useMetamask();


  useEffect(() => {
    const checkConnection = async () => {
      const walletData = await tryConnectingMetamask();
      if (walletData?.walletAddress) {
        onWalletConnected(walletData.walletAddress);
      }
    };
    checkConnection();
  }, [tryConnectingMetamask, onWalletConnected]);

  const handleConnect = async () => {
    const walletData = await connectMetamask();
    if (walletData?.walletAddress) {
      onWalletConnected(walletData.walletAddress);
    }
  };

  return (
    <>
      {signer ? (
        <p>Conectado {walletAddress}</p>
      ) : (
        <Button onClick={handleConnect}>Connect Wallet</Button>
      )}
    </>
  );
};

export default ConnectButton;