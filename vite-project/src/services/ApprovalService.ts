import { contracts, tokenInfos } from "../constants";
import AccountService from "./AccountService";
import { getToken, getNft } from "./ContractService";

const bundleAddress = "0x448E3D0a4BAa00FE511a03E7B27177AeDE6d9636"; // Replace with actual bundle address

export default {
  isApprovedToken: async (tokenSymbol) => {
    const contract = getToken(tokenSymbol);
    const { walletAddress } = await AccountService.getAccountData();
    const allowance = await contract.allowance(walletAddress, bundleAddress);
    const maxAllowance = tokenInfos[tokenSymbol].maxAllowance;
    return (allowance.toString() - maxAllowance) === 0;
  },
  approveTokens: async (tokenSymbol, setIsApproving, setIsAskingPermission) => {
    const contract = getToken(tokenSymbol);
    const { signer } = await AccountService.getAccountData();

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
  isApprovedNft: async () => {
    const contract = getNft();
    const { walletAddress } = await AccountService.getAccountData();
    const isApproved = await contract.isApprovedForAll(walletAddress, bundleAddress);
    return isApproved;
  },
  approveNft: async (tokenId, setIsApproving, setIsAskingPermission) => {
    const contract = getNft();
    const { signer } = await AccountService.getAccountData();

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