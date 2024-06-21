import { useState, useEffect } from "react";
import ApprovalService from "../services/ApprovalService";

const useNftApproval = (tokenId:number,chainId:number) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isAskingPermission, setIsAskingPermission] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const checkIsApproved = async () => {
      const isApproved = await ApprovalService.isApprovedNft(chainId);
      setIsApproved(isApproved);
    };

    checkIsApproved();
  }, []);

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