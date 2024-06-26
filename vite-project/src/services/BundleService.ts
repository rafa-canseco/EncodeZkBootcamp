import AccountService from "./AccountService";
import { GAS_LIMIT, getBundleAddress } from "../constants";
import { getBundler } from "./ContractService";
import { ethers } from "ethers";
import { Asset } from "../types/index";

// Helper function to execute a transaction and handle errors
const executeTransaction = async (
  transactionFunction: () => Promise<ethers.ContractTransaction>,
  errorMessage: string
) => {
  try {
    const tx = await transactionFunction();
    const receipt = await (tx as any).wait();
    console.log(receipt.hash)
    return receipt.hash;
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

export default {
  bundletokens: async (selectedAssets: Asset[], chainId: number, erc20Quantities: {[address: string]: string}) => {
    console.log("Selected Assets:", selectedAssets);
    console.log("ERC20 Quantities:", erc20Quantities);

    const { signer } = await AccountService.getAccountData();
    const bundlerAddress = getBundleAddress(chainId);
    console.log("Bundler Address:", bundlerAddress);
    const bundler = await getBundler(bundlerAddress);

    // Map selected assets to the format expected by the bundler contract
    const assets = selectedAssets.map((asset) => ({
      category: asset.type === 'ERC20' ? 0 : 1,
      assetAddress: asset.token_address || asset.address,
      id: asset.type === 'ERC20' ? 0 : (asset.token_id || asset.id),
      amount: asset.type === 'ERC20' 
        ? ethers.parseUnits(erc20Quantities[asset.token_address || ''] || asset.quantity || '0', 18)
        : BigInt(1),
    }));
    console.log("Mapped Assets:", assets);

    const result = await executeTransaction(
      () => (bundler as any).connect(signer).create(assets, { gasLimit: GAS_LIMIT }),
      "Error bundling assets:"
    );
    return result
  },

  unbundle: async (selectedAssets: Asset[], chainId: number) => {
    const tokenId = selectedAssets.find((asset) => asset.type !== 'ERC20')?.token_id;
    console.log("Unbundling Token ID:", tokenId);
    if (!tokenId) {
      throw new Error("No NFT selected for unbundling.");
    }

    const { signer } = await AccountService.getAccountData();
    const bundler = await getBundler(getBundleAddress(chainId));

    return executeTransaction(
      () => (bundler as any).connect(signer).unwrap(tokenId, { gasLimit: GAS_LIMIT }),
      "Error unbundling asset:"
    );
  }
};