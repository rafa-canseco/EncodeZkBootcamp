import axios from "axios";
import { useState, useEffect } from "react";

const Landing = ({ walletAddress }) => {
  const [erc20Assets, setErc20Assets] = useState([]);
  const [nftAssets, setNftAssets] = useState([]);

  const fetchAssets = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get_assets", {
        params: {
          address: walletAddress,
          blockchain: "ethereum",
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
    try {
      const response = await axios.post("http://localhost:8000/manage_assets", {
        address: walletAddress,
        blockchains: ["ethereum"],
      });
      const data = response.data;
      console.log("Manage Assets Response:", data);
      setErc20Assets(data.erc20_assets);
      setNftAssets(data.nft_assets);
    } catch (error) {
      console.error("Error managing assets:", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchAssets();
    }
  }, [walletAddress]);

  return (
    <div>
      <p className="text-lg underline">Bienvenido a Nuestra Página</p>
      {walletAddress ? (
        <>
          <p className="mt-4">Dirección de la Wallet: {walletAddress}</p>
          <button
            onClick={manageAssets}
            className="mt-4 p-2 bg-blue-500 text-white"
          >
            Actualizar Activos
          </button>
          <div>
            <h2 className="mt-4">ERC20 Assets</h2>
            <ul>
              {erc20Assets.map((asset, index) => (
                <li key={index}>
                  <p>Dirección: {asset.address}</p>
                  <p>Blockchain: {asset.blockchain}</p>
                  <p>ID: {asset.id}</p>
                  <p>Nombre: {asset.name}</p>
                  <p>Cantidad: {asset.quantity}</p>
                  <p>Símbolo: {asset.symbol}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mt-4">NFT Assets</h2>
            <ul>
              {nftAssets.map((asset, index) => (
                <li key={index}>
                  <p>Dirección: {asset.address}</p>
                  <p>Blockchain: {asset.blockchain}</p>
                  <p>ID: {asset.id}</p>
                  <p>Nombre: {asset.name}</p>
                  <p>Cantidad: {asset.quantity}</p>
                  {asset.image_url && (
                    <img src={asset.image_url} alt={asset.name} width="50" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="mt-4">Por favor, conecta tu wallet.</p>
      )}
    </div>
  );
};

export default Landing;
