import { useState, useEffect } from "react";
import ApprovalService from "../services/ApprovalService";

const useNftApproval = (spenderAddress, tokenId) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isAskingPermission, setIsAskingPermission] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const checkIsApproved = async () => {
      const isApproved = await ApprovalService.isApprovedNft(spenderAddress);
      setIsApproved(isApproved);
    };

    checkIsApproved();
  }, [spenderAddress]);

  const approve = async () => {
    setIsAskingPermission(true);
    await ApprovalService.approveNft(
      spenderAddress,
      tokenId,
      setIsApproving,
      setIsAskingPermission
    );
    const isApproved = await ApprovalService.isApprovedNft(spenderAddress);
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