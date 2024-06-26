import React, { useState } from "react";
import { useAssets } from "../hooks/useAssets";
import { truncateAddress, handleSelectAsset } from "../utils/helpers";
import { Button } from "@/components/ui/button";
import ERC20Assets from "../components/others/ERC20Assets";
import NFTAssets from "../components/others/NFTAssets";
import { LandingProps, UseAssetsReturn } from "../types/index";
import axios from 'axios';

const Landing: React.FC<LandingProps> = ({ walletAddress }) => {
  const [bundleResult, setBundleResult] = useState<string | null>(null);
  const [zkpHash, setZkpHash] = useState<string | null>(null);

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

  const handleBundleWithResult = async () => {
    const result = await handleBundle();
    if(result !== undefined){
      setBundleResult(result);
      try {
        const response = await axios.post('http://localhost:8000/get_14_digit_hash', {
          input_str: result,
        });
        console.log("API Response:", response.data); // Imprime la respuesta de la API
        if (response.data && response.data.hash) {
          setZkpHash(response.data.hash);
        }
      } catch (error) {
        console.error('Error fetching 14-digit hash:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {walletAddress ? (
        <>
          <div className="flex space-x-2 mt-4">
            <Button onClick={manageAssets} disabled={loading}>
              {loading ? "Updating..." : "Update Assets"}
            </Button>
            <Button
              onClick={handleBundleWithResult}
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
              {bundleResult && (
                <div className="mt-4">
                  <p>Transaction Hash: {bundleResult}</p>
                  {zkpHash && <p>Hash for ZKP: {zkpHash}</p>}
                </div>
              )}
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