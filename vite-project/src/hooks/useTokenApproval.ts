import { useState, useEffect } from "react";
import ApprovalService from "../services/ApprovalService";

const useTokenApproval = (symbol, spenderAddress) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isAskingPermission, setIsAskingPermission] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const checkIsApproved = async () => {
      const isApproved = await ApprovalService.isApprovedToken(symbol, spenderAddress);
      setIsApproved(isApproved);
    };

    checkIsApproved();
  }, [symbol, spenderAddress]);

  const approve = async () => {
    setIsAskingPermission(true);
    await ApprovalService.approveTokens(
      symbol,
      spenderAddress,
      setIsApproving,
      setIsAskingPermission
    );
    const isApproved = await ApprovalService.isApprovedToken(symbol, spenderAddress);
    setIsApproved(isApproved);
  };

  return {
    isApproved,
    isAskingPermission,
    isApproving,
    approve,
  };
};

export default useTokenApproval;