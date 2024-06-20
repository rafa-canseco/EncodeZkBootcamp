import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ERC20Assets from "../components/others/ERC20Assets";
import NFTAssets from "../components/others/NFTAssets";
import BundleService from "../services/BundleService"; // Importar BundleService

const Landing = ({ walletAddress }) => {
  const [erc20Assets, setErc20Assets] = useState([]);
  const [nftAssets, setNftAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get_assets", {
        params: {
          address: walletAddress,
          blockchain: "sepolia",
        },
      });
      const data = response.data;
      console.log("Fetch Assets Response:", data);
      setErc20Assets(data.erc20_assets);
      setNftAssets(data.nft_assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const manageAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/manage_assets", {
        address: walletAddress,
        blockchains: ["sepolia"],
      });
      const data = response.data;
      console.log("Manage Assets Response:", data);
      setErc20Assets(data.erc20_assets);
      setNftAssets(data.nft_assets);
    } catch (error) {
      console.error("Error managing assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchAssets();
    }
  }, [walletAddress]);

  const truncateAddress = (address) => {
    const maxLength = 20;
    return address.length > maxLength
      ? `${address.slice(0, maxLength)}...`
      : address;
  };

  const handleSelectAsset = (asset) => {
    setSelectedAssets((prevSelected) => {
      const isSelected = prevSelected.some((a) => a.token_id === asset.token_id && a.token_address === asset.token_address);
      if (isSelected) {
        return prevSelected.filter((a) => !(a.token_id === asset.token_id && a.token_address === asset.token_address));
      } else {
        return [...prevSelected, asset];
      }
    });
  };

  const handleBundle = async () => {
    const selectedTokens = selectedAssets.filter(asset => asset.type === 'ERC20');
    const selectedNFTs = selectedAssets.filter(asset => asset.type !== 'ERC20');
  
    try {
      const bundleId = await BundleService.bundletokens(selectedTokens, selectedNFTs);
      console.log("Assets bundled with ID:", bundleId);
    } catch (error) {
      console.error("Error bundling assets:", error);
    }
  };

  return (
    <div>
      <p className="text-lg underline">Bienvenido a Nuestra Página</p>
      {walletAddress ? (
        <>
          <p className="mt-4">
            Dirección de la Wallet: {truncateAddress(walletAddress)}
          </p>
          <Button onClick={manageAssets} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Activos"}
          </Button>
          {loading ? (
            <p className="mt-4">Cargando activos...</p>
          ) : (
            <>
              <ERC20Assets
                assets={erc20Assets}
                truncateAddress={truncateAddress}
                onSelectAsset={handleSelectAsset}
                selectedAssets={selectedAssets}
                walletAddress={walletAddress}  
              />
              <NFTAssets
                assets={nftAssets}
                truncateAddress={truncateAddress}
                onSelectAsset={handleSelectAsset}
                selectedAssets={selectedAssets}
              />
              <Button onClick={handleBundle} disabled={selectedAssets.length === 0}>
                Bundle Assets
              </Button>
            </>
          )}
        </>
      ) : (
        <p className="mt-4">Por favor, conecta tu wallet.</p>
      )}
    </div>
  );
}

export default Landing;