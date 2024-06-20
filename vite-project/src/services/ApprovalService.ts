import { contracts, tokenInfos } from "../constants";
import AccountService from "./AccountService";
import { getToken, getNft } from "./ContractService";

export default {
  isApprovedToken: async (tokenSymbol, spenderAddress) => {
    const contract = getToken(tokenSymbol);
    const { walletAddress } = await AccountService.getAccountData();
    const allowance = await contract.allowance(walletAddress, spenderAddress);
    const maxAllowance = tokenInfos[tokenSymbol].maxAllowance;
    return (allowance.toString() - maxAllowance) === 0;
  },
  approveTokens: async (tokenSymbol, spenderAddress, setIsApproving, setIsAskingPermission) => {
    const contract = getToken(tokenSymbol);
    const { signer } = await AccountService.getAccountData();

    try {
      const maxAllowance = tokenInfos[tokenSymbol].maxAllowance;

      const tx = await contract.connect(signer).approve(
        spenderAddress,
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
  isApprovedNft: async (spenderAddress) => {
    const contract = getNft();
    const { walletAddress } = await AccountService.getAccountData();
    const isApproved = await contract.isApprovedForAll(walletAddress, spenderAddress);
    return isApproved;
  },
  approveNft: async (spenderAddress, tokenId, setIsApproving, setIsAskingPermission) => {
    const contract = getNft();
    const { signer } = await AccountService.getAccountData();

    try {
      const tx = await contract.connect(signer).approve(
        spenderAddress,
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