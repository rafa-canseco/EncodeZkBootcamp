import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import useTokenApproval from "../../hooks/useTokenApproval";
import { TokenSymbol, ChainId } from "@/types";

const TokenApprovalButton: React.FC<{symbol: TokenSymbol; chainId: ChainId}> = ({ symbol, chainId }) => {
  const { isApproved, isAskingPermission, isApproving, approve } = useTokenApproval(symbol, chainId);
  const [text, setText] = useState('Approve');

  useEffect(() => {
    if (isApproved) {
      setText('Approved');
    } else if (isAskingPermission) {
      setText('Approve in your wallet');
    } else if (isApproving) {
      setText('Approving');
    } else {
      setText(`Approve use of ${symbol}`);
    }
  }, [isApproved, isAskingPermission, isApproving, symbol]);

  return (
    <Button onClick={approve} disabled={isApproved || isAskingPermission || isApproving}>
      {(isAskingPermission || isApproving) && (
        <>
          <ClipLoader color='#babfcf' loading={true} size={18} speedMultiplier={0.75} />
          &nbsp;&nbsp;
        </>
      )}
      {text}
    </Button>
  );
};

export default TokenApprovalButton;