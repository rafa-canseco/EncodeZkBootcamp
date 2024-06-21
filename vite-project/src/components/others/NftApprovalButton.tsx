import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import useNftApproval from "../../hooks/useNftApproval";

const NftApprovalButton = ({ tokenId ,chainId}) => {
  const { isApproved, isAskingPermission, isApproving, approve } = useNftApproval( tokenId,chainId);
  const [text, setText] = useState('Approve');

  useEffect(() => {
    if (isApproved) {
      setText('Approved');
    } else if (isAskingPermission) {
      setText('Approve in your wallet');
    } else if (isApproving) {
      setText('Approving');
    } else {
      setText('Approve NFT');
    }
  }, [isApproved, isAskingPermission, isApproving]);

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

export default NftApprovalButton;