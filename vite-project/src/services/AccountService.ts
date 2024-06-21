import { ethers } from "ethers";
import { Window, AccountData, ChainId } from "../types/index";

declare let window: Window;

const getProvider = () => new ethers.BrowserProvider(window.ethereum);

const getSigner = async () => {
  const provider = getProvider();
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length > 0) {
    return provider.getSigner();
  }
  return null;
};

const getChainId = async (
  signer: ethers.Signer | null
): Promise<ChainId | null> => {
  if (signer && signer.provider) {
    const network = await signer.provider.getNetwork();
    const chainId = Number(network.chainId);
    if (chainId === 11155111 || chainId === 84532 || chainId === 1) {
      return chainId as ChainId;
    }
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

  connectWallet: async (): Promise<AccountData> => {
    const provider = getProvider();
    await provider.send("eth_requestAccounts", []);
    const signer = await getSigner();
    const walletAddress = await getWalletAddress(signer);
    const chainId = await getChainId(signer);
    return { provider, signer, walletAddress, chainId };
  },

  getAccountData: async (): Promise<AccountData> => {
    const provider = getProvider();
    const signer = await getSigner();
    const walletAddress = await getWalletAddress(signer);
    const chainId = await getChainId(signer);
    return { provider, signer, walletAddress, chainId };
  },
};
