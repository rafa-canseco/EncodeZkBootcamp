import { useState, useEffect } from "react";
import axios from "axios";
import AccountService from "../services/AccountService";
import BundleService from "../services/BundleService";
import { Asset, ERC20Asset, NFTAsset,UseAssetsReturn } from "../types/index";

export const useAssets = (walletAddress: string | null): UseAssetsReturn => {
  const [erc20Assets, setErc20Assets] = useState<ERC20Asset[]>([]);
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [chainId, setChainId] = useState<any>(null);
  const [erc20Quantities, setErc20Quantities] = useState<{[address: string]: string}>({});

  useEffect(() => {
    const fetchAccountData = async () => {
      const { chainId } = await AccountService.getAccountData();
      setChainId(chainId);
      if (walletAddress) {
        fetchAssets();
      }
    };
    fetchAccountData();
  }, [walletAddress]);

  const handleQuantityChange = (address: string, quantity: string) => {
    setErc20Quantities(prev => ({...prev, [address]: quantity}));
  };

  // Fetch assets from the API
  const fetchAssets = async () => {
    try {
      const response = await axios.get(
        "https://apipwn.readymad3.com/get_assets",
        {
          params: {
            address: walletAddress,
            blockchain:
              chainId === 11155111
                ? "sepolia"
                : chainId === 84532
                ? "base sepolia"
                : "eth",
          },
        }
      );
      const data = response.data;
      setErc20Assets(data.erc20_assets);
      setNftAssets(data.nft_assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  // Manage assets by making a POST request to the API
  const manageAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://apipwn.readymad3.com/manage_assets",
        {
          address: walletAddress,
          blockchains: [
            chainId === 11155111
              ? "sepolia"
              : chainId === 84532
              ? "base sepolia"
              : "eth",
          ],
        }
      );
      const data = response.data;
      setErc20Assets(data.erc20_assets);
      setNftAssets(data.nft_assets);
    } catch (error) {
      console.error("Error managing assets:", error);
    } finally {
      setLoading(false);
      fetchAssets();
    }
  };

  // Handle the bundling of assets
  const handleBundle = async () => {
    if (selectedAssets.length === 0) return null;
    setProcessing(true);
    setMessage("");
    try {
      const result = await BundleService.bundletokens(selectedAssets, chainId!, erc20Quantities);
      setMessage(`Bundle created successfully. wait a second`);
      setTimeout(() => {
        setMessage("");
        manageAssets();
      }, 10000);
      return result;
    } catch (error) {
      console.error("Error bundling assets:", error);
      setMessage("Error creating the bundle. Please try again.");
      return null;
    } finally {
      setProcessing(false);
    }
  };

  // Handle the unbundling of assets
  const handleUnbundle = async () => {
    setProcessing(true);
    setMessage("Unbundling assets, please wait...");
    try {
      if (chainId === null) {
        throw new Error("ChainId is not available");
      }
      await BundleService.unbundle(selectedAssets, chainId);
      setTimeout(() => {
        setMessage("");
        manageAssets();
      }, 10000);
    } catch (error) {
      console.error("Error unbundling assets:", error);
    } finally {
      setProcessing(false);
    }
  };

  return {
    erc20Assets,
    nftAssets,
    selectedAssets,
    setSelectedAssets,
    loading,
    processing,
    message,
    chainId,
    fetchAssets,
    manageAssets,
    handleBundle,
    handleUnbundle,
    erc20Quantities,
    handleQuantityChange,
  };
};
