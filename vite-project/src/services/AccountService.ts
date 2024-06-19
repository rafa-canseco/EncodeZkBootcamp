interface Window {
    ethereum: any;
  }
  
  declare let window: Window;
  
  import { ethers } from "ethers";
  
  const getProvider = () => new ethers.BrowserProvider(window.ethereum);
  
  const getSigner = async () => {
    const provider = getProvider();
    const accounts = await provider.send("eth_accounts", []);
    if (accounts.length > 0) {
      return provider.getSigner();
    }
    return null;
  };

const getWalletAddress = async (signer: ethers.Signer | null) => {
    if (signer) {
      return await signer.getAddress();
    }
    return null;
  };

export default {
  getProvider: () => getProvider(),

  connectWallet: async () => {
    const provider = getProvider();
    await provider.send("eth_requestAccounts", []);
    const signer = await getSigner();
    const walletAddress = await getWalletAddress(signer);
    return { provider, signer, walletAddress };
  },

  getAccountData: async () => {
    const provider = getProvider();
    const signer = await getSigner();
    const walletAddress = await getWalletAddress(signer);
    return { provider, signer, walletAddress };
  }
};