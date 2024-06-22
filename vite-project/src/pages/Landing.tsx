import React from "react";
import { useAssets } from "../hooks/useAssets";
import { truncateAddress, handleSelectAsset } from "../utils/helpers";
import { Button } from "@/components/ui/button";
import ERC20Assets from "../components/others/ERC20Assets";
import NFTAssets from "../components/others/NFTAssets";
import { LandingProps,  UseAssetsReturn } from "../types/index";

const Landing: React.FC<LandingProps> = ({ walletAddress }) => {
  const {
    erc20Assets,
    nftAssets,
    selectedAssets,
    setSelectedAssets,
    loading,
    processing,
    message,
    chainId,
    manageAssets,
    handleBundle,
    handleUnbundle,
    erc20Quantities,
    handleQuantityChange,
  }: UseAssetsReturn = useAssets(walletAddress);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {walletAddress ? (
        <>
          <div className="flex space-x-2 mt-4">
            <Button onClick={manageAssets} disabled={loading}>
              {loading ? "Updating..." : "Update Assets"}
            </Button>
            <Button
              onClick={handleBundle}
              disabled={selectedAssets.length === 0 || processing}
            >
              Bundle Assets
            </Button>
            <Button
              onClick={handleUnbundle}
              disabled={selectedAssets.length === 0 || processing}
            >
              Unbundle Assets
            </Button>
          </div>
          {loading ? (
            <p className="mt-4">Loading assets...</p>
          ) : (
            <>
              {message && <p className="mt-4">{message}</p>}
              <div className="text-center text-2xl mt-4">ERC20 Assets</div>
              <ERC20Assets
                assets={erc20Assets}
                truncateAddress={truncateAddress}
                onSelectAsset={(asset) =>
                  handleSelectAsset(asset, selectedAssets, setSelectedAssets)
                }
                selectedAssets={selectedAssets}
                chainId={chainId!}
                quantities={erc20Quantities}
                onQuantityChange={handleQuantityChange}
              />
              <div className="text-center text-2xl mt-4">NFT Assets</div>
              <NFTAssets
                assets={nftAssets}
                truncateAddress={truncateAddress}
                onSelectAsset={(asset) =>
                  handleSelectAsset(asset, selectedAssets, setSelectedAssets)
                }
                selectedAssets={selectedAssets}
                chainId={chainId!}
              />
            </>
          )}
        </>
      ) : (
        <p className="mt-4">Please connect your wallet.</p>
      )}
    </div>
  );
};

export default Landing;