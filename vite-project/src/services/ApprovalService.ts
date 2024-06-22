import { contracts, tokenInfos, getBundleAddress } from "../constants";
import AccountService from "./AccountService";
import { getToken, getNft } from "./ContractService";
import { ChainId, TokenSymbol } from "../types/index";

// Helper function to get token address based on token symbol and chain ID
const getTokenAddress = (tokenSymbol: TokenSymbol, chainId: ChainId): string => {
  const tokenInfo = (tokenInfos as any)[tokenSymbol];
  if (!tokenInfo) {
    throw new Error(`Token symbol ${tokenSymbol} is not defined in tokenInfos`);
  }
  if (typeof tokenInfo.address === "object") {
    switch (chainId) {
      case 11155111:
        return tokenInfo.address.sepolia;
      case 84532:
        return tokenInfo.address.baseSepolia;
      default:
        throw new Error(`Unsupported chainId: ${chainId}`);
    }
  }
  return tokenInfo.address as string;
};

// Helper function to get NFT address based on chain ID
const getNftAddress = (chainId: ChainId): string => {
  switch (chainId) {
    case 11155111:
      return contracts.BUNDLER.NFT.address.sepolia;
    case 84532:
      return contracts.BUNDLER.NFT.address.baseSepolia;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
};

export default {
  // Check if a token is approved
  isApprovedToken: async (tokenSymbol: TokenSymbol, chainId: ChainId) => {
    const tokenAddress = getTokenAddress(tokenSymbol, chainId);
    const contract = getToken(tokenAddress);
    const { walletAddress } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);
    const allowance = await (contract as any).allowance(walletAddress, bundleAddress);
    const maxAllowance = (tokenInfos as any)[tokenSymbol].maxAllowance;
    return allowance.toString() - maxAllowance === 0;
  },

  // Approve tokens for bundling
  approveTokens: async (
    tokenSymbol: TokenSymbol,
    setIsApproving: (value: boolean) => void,
    setIsAskingPermission: (value: boolean) => void,
    chainId: ChainId
  ) => {
    const tokenAddress = getTokenAddress(tokenSymbol, chainId);
    const contract = getToken(tokenAddress);
    const { signer } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);

    try {
      const maxAllowance = (tokenInfos as any)[tokenSymbol].maxAllowance;

      const tx = await (contract as any)
        .connect(signer)
        .approve(bundleAddress, maxAllowance);

      setIsAskingPermission(false);
      setIsApproving(true);

      await tx.wait();

      setIsApproving(false);
    } catch (error) {
      setIsApproving(false);
      setIsAskingPermission(false);
      console.error("approveTokens error:", error);
    }
  },

  // Check if an NFT is approved
  isApprovedNft: async (chainId: ChainId) => {
    const nftAddress = getNftAddress(chainId);
    const contract = getNft(nftAddress);

    const { walletAddress } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);
    const isApproved = await (contract as any).isApprovedForAll(
      walletAddress,
      bundleAddress
    );
    return isApproved;
  },

  // Approve NFT for bundling
  approveNft: async (
    tokenId: string | number,
    setIsApproving: (value: boolean) => void,
    setIsAskingPermission: (value: boolean) => void,
    chainId: ChainId
  ) => {
    const nftAddress = getNftAddress(chainId);
    const contract = getNft(nftAddress);
    const { signer } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);

    try {
      const tx = await (contract as any).connect(signer).approve(bundleAddress, tokenId);

      setIsAskingPermission(false);
      setIsApproving(true);

      await tx.wait();

      setIsApproving(false);
    } catch (error) {
      setIsApproving(false);
      setIsAskingPermission(false);
      console.error("approveNft error:", error);
    }
  },
};
