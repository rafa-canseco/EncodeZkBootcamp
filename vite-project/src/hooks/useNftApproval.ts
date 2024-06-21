import { useState, useEffect } from "react";
import ApprovalService from "../services/ApprovalService";
import { ChainId } from "../types/index";

const useNftApproval = (tokenId: string, chainId: ChainId) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isAskingPermission, setIsAskingPermission] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const checkIsApproved = async () => {
      const isApproved = await ApprovalService.isApprovedNft(chainId);
      setIsApproved(isApproved);
    };

    checkIsApproved();
  }, [chainId]);

  const approve = async () => {
    setIsAskingPermission(true);
    await ApprovalService.approveNft(
      tokenId,
      setIsApproving,
      setIsAskingPermission,
      chainId
    );
    const isApproved = await ApprovalService.isApprovedNft(chainId);
    setIsApproved(isApproved);
  };

  return {
    isApproved,
    isAskingPermission,
    isApproving,
    approve,
  };
};

export default useNftApproval;
