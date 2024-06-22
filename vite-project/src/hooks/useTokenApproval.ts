import { useState, useEffect } from "react";
import ApprovalService from "../services/ApprovalService";
import { tokenInfos } from "../constants";
import { ChainId, TokenSymbol } from "../types/index";

// Custom hook to manage token approval state and actions
const useTokenApproval = (symbol: TokenSymbol, chainId: ChainId) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isAskingPermission, setIsAskingPermission] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    // Check if the token is approved when symbol or chainId changes
    const checkIsApproved = async () => {
      if (tokenInfos[symbol]) {
        const isApproved = await ApprovalService.isApprovedToken(
          symbol,
          chainId
        );
        setIsApproved(isApproved);
      } else {
        console.error(`Token symbol ${symbol} is not defined in tokenInfos`);
      }
    };

    checkIsApproved();
  }, [symbol, chainId]);

  // Function to approve the token
  const approve = async () => {
    if (tokenInfos[symbol]) {
      setIsAskingPermission(true);
      await ApprovalService.approveTokens(
        symbol,
        setIsApproving,
        setIsAskingPermission,
        chainId
      );
      const isApproved = await ApprovalService.isApprovedToken(symbol, chainId);
      setIsApproved(isApproved);
    } else {
      console.error(`Token symbol ${symbol} is not defined in tokenInfos`);
    }
  };

  return {
    isApproved,
    isAskingPermission,
    isApproving,
    approve,
  };
};

export default useTokenApproval;
