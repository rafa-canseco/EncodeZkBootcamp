import { ethers } from "ethers";

export interface Asset {
  type: 'ERC20' | 'NFT';
  token_address?: string;
  address?: string;
  token_id?: string;
  id?: string;
  quantity?: string;
}

export interface TokenInfo {
  address: string | {[key: string]: string};
  decimals: number;
  name: string;
  maxAllowance: string;
}

export type ChainId = 11155111 | 84532 | 1; // Sepolia, Base Sepolia, Ethereum

export interface AccountData {
  provider: ethers.BrowserProvider;
  signer: ethers.Signer | null;
  walletAddress: string | null;
  chainId: number | null;
}

export interface Window {
  ethereum: any;
}

export type TokenSymbol = keyof typeof import('../constants').tokenInfos;

export interface ContractABI {
  abi: ethers.InterfaceAbi;
}

export interface NavbarProps {
    onWalletConnected: (address: string) => void;
  }

  export interface LandingProps {
    walletAddress: string | null;
  }

  export interface ERC20Asset extends Asset {
    name: string;
    symbol: string;
    blockchain: string;
    asset_price: string;
    image_url?: string;
  }

export interface ERC20AssetsProps {
  assets: ERC20AssetExtended[];
  truncateAddress: (address: string) => string;
  onSelectAsset: (asset: ERC20AssetExtended) => void;
  selectedAssets: any[];
  chainId: ChainId;
  quantities: { [address: string]: string };
  onQuantityChange: (address: string, quantity: string) => void;
}

  export interface NFTAsset extends Asset {
    name: string;
    token_id: any;
    blockchain: string;
    quantity: string;
    image_url?: string;
  }
  
  export interface NFTAssetsProps {
    assets: NFTAsset[];
    truncateAddress: (address: string) => string;
    onSelectAsset: (asset: NFTAsset) => void;
    selectedAssets: any[];
    chainId: ChainId;
  }

  export interface NftApprovalButtonProps {
    tokenId: any;
    chainId: ChainId;
  }


export interface TokenApprovalButtonProps {
    symbol: TokenSymbol;
    chainId: ChainId;
  }
  
  export type ApprovedTokenSymbol = TokenSymbol;

  export interface ERC20AssetExtended extends ERC20Asset {
    approvedSymbol?: ApprovedTokenSymbol;
  }

  export interface TokenInfos {
    [key: string]: TokenInfo;
  }

  export interface UseAssetsReturn {
    erc20Assets: ERC20AssetExtended[];
    nftAssets: NFTAsset[];
    selectedAssets: Asset[];
    setSelectedAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
    loading: boolean;
    processing: boolean;
    message: string;
    chainId: ChainId | null;
    manageAssets: () => Promise<void>;
    handleBundle: () => Promise<void>;
    handleUnbundle: () => Promise<void>;
    handleQuantityChange : any
    erc20Quantities:any
    fetchAssets:any
  }