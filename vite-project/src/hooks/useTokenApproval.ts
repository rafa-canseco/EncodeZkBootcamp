import { useState, useEffect } from "react";
import ApprovalService from "../services/ApprovalService";
import { tokenInfos } from "../constants";
import { ChainId, TokenSymbol } from "../types/index";

const useTokenApproval = (symbol: TokenSymbol, chainId: ChainId) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isAskingPermission, setIsAskingPermission] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
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
