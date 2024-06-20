import { ethers } from "ethers";
import { 
    contracts, ERC20ABI, WethArtifact, BundlerArtifact, tokenInfos,
    ERC721ABI
} from "../constants";
import AccountService from "./AccountService";

type TokenSymbol = keyof typeof tokenInfos;

export const getBundler = () => {
    return new ethers.Contract(
        contracts.BUNDLER.address,
        BundlerArtifact.abi,
        AccountService.getProvider()
    );
};

export const getToken = (symbol: TokenSymbol) => {
    if (!tokenInfos[symbol]) {
        throw new Error(`Token symbol ${symbol} is not defined in tokenInfos`);
    }
    const abi = symbol === "WETH" ? WethArtifact.abi : ERC20ABI.abi;
    return new ethers.Contract(
        tokenInfos[symbol].address,
        abi,
        AccountService.getProvider()
    );
};

export const getNft = () => {
    return new ethers.Contract( 
        contracts.NFT.address,
        ERC721ABI.abi,
        AccountService.getProvider()
    );
};