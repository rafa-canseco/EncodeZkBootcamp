import { useState, useEffect } from "react";
import axios from "axios";
import AccountService from "../services/AccountService";
import BundleService from "../services/BundleService";
import { Asset, ERC20Asset, NFTAsset } from "../types/index";

export const useAssets = (walletAddress: string | null) => {
  const [erc20Assets, setErc20Assets] = useState<ERC20Asset[]>([]);
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [chainId, setChainId] = useState<any>(null);

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

  const handleBundle = async () => {
    setProcessing(true);
    setMessage("Bundling assets, please wait...");
    try {
      if (chainId === null) {
        throw new Error("ChainId no disponible");
      }
      await BundleService.bundletokens(selectedAssets, chainId);
    } catch (error) {
      console.error("Error al agrupar activos:", error);
    } finally {
      setProcessing(false);
      setTimeout(() => {
        setMessage("");
        manageAssets();
      }, 10000);
    }
  };

  const handleUnbundle = async () => {
    setProcessing(true);
    setMessage("Unbundling assets, please wait...");
    try {
      if (chainId === null) {
        throw new Error("ChainId no está disponible");
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
  };
};
