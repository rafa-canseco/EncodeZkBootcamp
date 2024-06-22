import { ethers } from "ethers";
import { Window, AccountData, ChainId } from "../types/index";

declare let window: Window;

// Create a new ethers BrowserProvider instance
const getProvider = () => new ethers.BrowserProvider(window.ethereum);

// Get the signer if an account is connected
const getSigner = async () => {
  const provider = getProvider();
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length > 0) {
    return provider.getSigner();
  }
  return null;
};

// Get the chain ID if a signer is available
const getChainId = async (
  signer: ethers.Signer | null
): Promise<ChainId | null> => {
  if (signer && signer.provider) {
    const network = await signer.provider.getNetwork();
    const chainId = Number(network.chainId);
    // Check if the chain ID is one of the supported networks
    if (chainId === 11155111 || chainId === 84532 || chainId === 1) {
      return chainId as ChainId;
    }
  }
  return null;
};

// Get the wallet address if a signer is available
const getWalletAddress = async (signer: ethers.Signer | null) => {
  if (signer) {
    return await signer.getAddress();
  }
  return null;
};

export default {
  getProvider: () => getProvider(),

  // Connect wallet and return account data
  connectWallet: async (): Promise<AccountData> => {
    const provider = getProvider();
    await provider.send("eth_requestAccounts", []);
    const signer = await getSigner();
    const walletAddress = await getWalletAddress(signer);
    const chainId = await getChainId(signer);
    return { provider, signer, walletAddress, chainId };
  },

  // Get current account data
  getAccountData: async (): Promise<AccountData> => {
    const provider = getProvider();
    const signer = await getSigner();
    const walletAddress = await getWalletAddress(signer);
    const chainId = await getChainId(signer);
    return { provider, signer, walletAddress, chainId };
  },
};
