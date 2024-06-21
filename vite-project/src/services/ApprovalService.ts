import { contracts, tokenInfos } from "../constants";
import AccountService from "./AccountService";
import { getToken, getNft } from "./ContractService";

const getBundleAddress = (chainId:number) => {
  switch (chainId) {
    case 11155111:
      return contracts.BUNDLER.address.sepolia; 
    case 84532:
      return contracts.BUNDLER.address.baseSepolia; 
    default:
      return contracts.BUNDLER.address.ethereum;
  }
};

const getTokenAddress = (tokenSymbol, chainId) => {
  const tokenInfo = tokenInfos[tokenSymbol];
  if (!tokenInfo) {
    throw new Error(`Token symbol ${tokenSymbol} is not defined in tokenInfos`);
  }
  if (typeof tokenInfo.address === 'object') {
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

const getNftAddress = (chainId) => {
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
  isApprovedToken: async (tokenSymbol, chainId) => {
    const tokenAddress = getTokenAddress(tokenSymbol, chainId);
    const contract = getToken(tokenAddress);
    const { walletAddress } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);
    const allowance = await contract.allowance(walletAddress, bundleAddress);
    const maxAllowance = tokenInfos[tokenSymbol].maxAllowance;
    return (allowance.toString() - maxAllowance) === 0;
  },
  approveTokens: async (tokenSymbol, setIsApproving, setIsAskingPermission, chainId) => {
    const tokenAddress = getTokenAddress(tokenSymbol, chainId);
    const contract = getToken(tokenAddress);
    const { signer } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);

    try {
      const maxAllowance = tokenInfos[tokenSymbol].maxAllowance;

      const tx = await contract.connect(signer).approve(
        bundleAddress,
        maxAllowance
      );

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
  isApprovedNft: async (chainId:number) => {
    const nftAddress = getNftAddress(chainId);
    const contract = getNft(nftAddress);

    const { walletAddress } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);
    const isApproved = await contract.isApprovedForAll(walletAddress, bundleAddress);
    return isApproved;
  },
  approveNft: async (tokenId, setIsApproving, setIsAskingPermission, chainId) => {
    const nftAddress = getNftAddress(chainId);
    const contract = getNft(nftAddress);
    const { signer } = await AccountService.getAccountData();
    const bundleAddress = getBundleAddress(chainId);

    try {
      const tx = await contract.connect(signer).approve(
        bundleAddress,
        tokenId
      );

      setIsAskingPermission(false);
      setIsApproving(true);

      await tx.wait();

      setIsApproving(false);
    } catch (error) {
      setIsApproving(false);
      setIsAskingPermission(false);
      console.error("approveNft error:", error);
    }
  }
};