import { useState, useEffect } from "react";
import AccountService from "../services/AccountService";

// Custom hook to manage Metamask connection state and actions
const useMetamask = () => {
  const [signer, setSigner] = useState<any | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Function to connect to Metamask
  const connectMetamask = async () => {
    const { signer, walletAddress } = await AccountService.connectWallet();
    setSigner(signer);
    setWalletAddress(walletAddress);
    return { signer, walletAddress };
  };
  
  // Function to attempt connecting to Metamask using existing account data
  const tryConnectingMetamask = async () => {
    const { signer, walletAddress } = await AccountService.getAccountData();
    if (signer && walletAddress) {
        setSigner(signer);
        setWalletAddress(walletAddress);
      }
    return { signer, walletAddress };
  };

  // Attempt to connect to Metamask on component mount
  useEffect(() => {
    tryConnectingMetamask();
  }, []);

  return {
    connectMetamask,
    tryConnectingMetamask,
    signer,
    walletAddress
  };
};

export default useMetamask;