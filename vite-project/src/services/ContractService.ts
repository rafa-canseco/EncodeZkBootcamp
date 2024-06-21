import { ethers } from "ethers";
import {  ERC20ABI, BundlerArtifact, tokenInfos,
    ERC721ABI
} from "../constants";
import AccountService from "./AccountService";

type TokenSymbol = keyof typeof tokenInfos;


export const getBundler = (bundlerAddress:string) => {
    return new ethers.Contract(
        bundlerAddress,
        BundlerArtifact.abi,
        AccountService.getProvider()
    );
};

export const getToken = (symbol: TokenSymbol) => {
    const abi = ERC20ABI.abi;
    return new ethers.Contract(
        symbol,
        abi,
        AccountService.getProvider()
    );
};

export const getNft = (nftAddress:string) => {
  return new ethers.Contract(
      nftAddress,
      ERC721ABI.abi,
      AccountService.getProvider()
  );
};

