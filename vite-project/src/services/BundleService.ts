import AccountService from "./AccountService";
import { contracts, GAS_LIMIT, tokenInfos } from "../constants";
import { getBundler, getToken } from "./ContractService";
import { ethers } from "ethers";

let isConfirming = false;
const setisConfirming = (value: boolean) => {
    isConfirming = value;
};

export default {
    bundletokens: async (selectedTokens: any[], selectedNFTs: any[]) => {
        setisConfirming(true);
        console.log("Selected Tokens:", selectedTokens);
        console.log("Selected NFTs:", selectedNFTs);

        const { signer } = await AccountService.getAccountData();
        const bundler = await getBundler();

        const tokenAssets = selectedTokens.map((token) => ({
            category: 0,
            assetAddress: token.token_address,
            id: 0,
            amount: ethers.parseUnits(token.quantity, 18) // Asegurarse de que la cantidad esté en la unidad correcta
        }));
        console.log("Token Assets:", tokenAssets);

        const nftAssets = selectedNFTs.map((nft) => ({
            category: 1,
            assetAddress: nft.token_address,
            id: nft.token_id,
            amount: 1 // Los NFTs generalmente tienen una cantidad de 1
        }));
        console.log("NFT Assets:", nftAssets);

        const assets = [...tokenAssets, ...nftAssets];
        console.log("All Assets:", assets);

        try {
            const tx = await bundler.connect(signer).create(assets, { gasLimit: GAS_LIMIT }); // Asegurarse de pasar todos los activos y establecer el límite de gas
            const receipt = await tx.wait();
            setisConfirming(false);
            return receipt.transactionHash;
        } catch (error) {
            setisConfirming(false);
            console.error("Error bundling assets:", error);
            throw error;
        }
    }
};