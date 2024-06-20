import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import useTokenApproval from "../../hooks/useTokenApproval";

const TokenApprovalButton = ({ symbol, spenderAddress }) => {
  const { isApproved, isAskingPermission, isApproving, approve } = useTokenApproval(symbol, spenderAddress);
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
          <ClipLoader color='#babfcf' loading={true} size={18} speedMultiplier="0.75" />
          &nbsp;&nbsp;
        </>
      )}
      {text}
    </Button>
  );
};

export default TokenApprovalButton;