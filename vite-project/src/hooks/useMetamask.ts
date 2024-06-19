import { useState, useEffect } from "react";
import AccountService from "../services/AccountService";
import { JsonRpcSigner } from "@ethersproject/providers";

const useMetamask = () => {
const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectMetamask = async () => {
    const { signer, walletAddress } = await AccountService.connectWallet();
    setSigner(signer as unknown as JsonRpcSigner);
    setWalletAddress(walletAddress);
    return { signer, walletAddress };
  };
  
  const tryConnectingMetamask = async () => {
    const { signer, walletAddress } = await AccountService.getAccountData();
    if (signer && walletAddress) {
        setSigner(signer as unknown as JsonRpcSigner);
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