import { contracts, tokenInfos, getBundleAddress } from "../constants";
import AccountService from "./AccountService";
import { getToken, getNft } from "./ContractService";
import { ChainId, TokenSymbol } from "../types/index";

const getTokenAddress = (tokenSymbol: TokenSymbol, chainId: ChainId): string => {
  const tokenInfoMap: any = tokenInfos;
  const tokenInfo = tokenInfoMap[tokenSymbol];
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
  return tokenInfo.address;
};

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
  isApprovedToken: async (tokenSymbol: TokenSymbol, chainId: ChainId) => {
    const tokenAddress = getTokenAddress(tokenSymbol, chainId);
    const contract = getToken(tokenAddress) as any;
    const { walletAddress } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);
    const allowance = await contract.allowance(walletAddress, bundleAddress);
    const tokenInfoMap: any = tokenInfos;
    const maxAllowance = tokenInfoMap[tokenSymbol].maxAllowance;
    return allowance.toString() - maxAllowance === 0;
  },
  approveTokens: async (
    tokenSymbol: TokenSymbol,
    setIsApproving: (value: boolean) => void,
    setIsAskingPermission: (value: boolean) => void,
    chainId: ChainId
  ) => {
    const tokenAddress = getTokenAddress(tokenSymbol, chainId);
    const contract = getToken(tokenAddress) as any;
    const { signer } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);

    try {
      const tokenInfoMap: any = tokenInfos;
      const maxAllowance = tokenInfoMap[tokenSymbol].maxAllowance;

      const tx = await contract
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
  isApprovedNft: async (chainId: ChainId) => {
    const nftAddress = getNftAddress(chainId);
    const contract = getNft(nftAddress) as any;

    const { walletAddress } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);
    const isApproved = await contract.isApprovedForAll(
      walletAddress,
      bundleAddress
    );
    return isApproved;
  },
  approveNft: async (
    tokenId: string | number,
    setIsApproving: (value: boolean) => void,
    setIsAskingPermission: (value: boolean) => void,
    chainId: ChainId
  ) => {
    const nftAddress = getNftAddress(chainId);
    const contract = getNft(nftAddress) as any;
    const { signer } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);

    try {
      const tx = await contract.connect(signer).approve(bundleAddress, tokenId);

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
