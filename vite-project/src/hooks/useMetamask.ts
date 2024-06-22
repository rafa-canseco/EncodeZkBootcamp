import { useState, useEffect } from "react";
import AccountService from "../services/AccountService";

const useMetamask = () => {
  const [signer, setSigner] = useState<any | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectMetamask = async () => {
    const { signer, walletAddress } = await AccountService.connectWallet();
    setSigner(signer);
    setWalletAddress(walletAddress);
    return { signer, walletAddress };
  };
  
  const tryConnectingMetamask = async () => {
    const { signer, walletAddress } = await AccountService.getAccountData();
    if (signer && walletAddress) {
        setSigner(signer);
        setWalletAddress(walletAddress);
      }
    return { signer, walletAddress };
  };

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