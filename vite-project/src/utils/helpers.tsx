import { Asset, ERC20Asset, NFTAsset } from "../types/index";

export const truncateAddress = (address: string): string => {
  const maxLength = 20;
  return address.length > maxLength
    ? `${address.slice(0, maxLength)}...`
    : address;
};

export const handleSelectAsset = (
  asset: ERC20Asset | NFTAsset,
  selectedAssets: Asset[],
  setSelectedAssets: React.Dispatch<React.SetStateAction<Asset[]>>
): void => {
  setSelectedAssets((prevSelected) => {
    const isSelected = selectedAssets.some(
      (a) =>
        a.token_id === asset.token_id && a.token_address === asset.token_address
    );
    if (isSelected) {
      return prevSelected.filter(
        (a) =>
          !(
            a.token_id === asset.token_id &&
            a.token_address === asset.token_address
          )
      );
    } else {
      if ("token_id" in asset && asset.token_id !== undefined) {
        return [...prevSelected, { ...asset, type: "NFT" as const }];
      } else {
        return [...prevSelected, { ...asset, type: "ERC20" as const }];
      }
    }
  });
};
