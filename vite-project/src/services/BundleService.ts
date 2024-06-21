import AccountService from "./AccountService";
import { GAS_LIMIT, getBundleAddress } from "../constants";
import { getBundler } from "./ContractService";
import { ethers } from "ethers";

interface Asset {
  type: 'ERC20' | 'NFT';
  token_address?: string;
  address?: string;
  token_id?: string;
  id?: string;
  quantity?: string;
}

const executeTransaction = async (
  transactionFunction: () => Promise<ethers.ContractTransaction>,
  errorMessage: string
) => {
  try {
    const tx = await transactionFunction();
    const receipt = await (tx as any).wait();
    return receipt.transactionHash;
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

export default {
  bundletokens: async (selectedAssets: Asset[], chainId: number) => {
    console.log("Selected Assets:", selectedAssets);

    const { signer } = await AccountService.getAccountData();
    const bundlerAddress = getBundleAddress(chainId);
    console.log("Bundler Address:", bundlerAddress);
    const bundler = await getBundler(bundlerAddress);

    const assets = selectedAssets.map((asset) => ({
      category: asset.type === 'ERC20' ? 0 : 1,
      assetAddress: asset.token_address || asset.address,
      id: asset.type === 'ERC20' ? 0 : (asset.token_id || asset.id),
      amount: asset.type === 'ERC20' ? ethers.parseUnits((asset.quantity || '0').toString(), 18) : BigInt(1),
    }));
    console.log("Mapped Assets:", assets);

    return executeTransaction(
      () => (bundler as any).connect(signer).create(assets, { gasLimit: GAS_LIMIT }),
      "Error bundling assets:"
    );
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