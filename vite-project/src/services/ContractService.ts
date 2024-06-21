import { ethers } from "ethers";
import { ERC20ABI, BundlerArtifact, ERC721ABI } from "../constants";
import AccountService from "./AccountService";
import { ContractABI } from "../types/index";

export const getBundler = (bundlerAddress: string): ethers.Contract => {
  return new ethers.Contract(
    bundlerAddress,
    (BundlerArtifact as ContractABI).abi,
    AccountService.getProvider()
  );
};

export const getToken = (address: string): ethers.Contract => {
  return new ethers.Contract(
    address,
    (ERC20ABI as ContractABI).abi,
    AccountService.getProvider()
  );
};

export const getNft = (nftAddress: string): ethers.Contract => {
  return new ethers.Contract(
    nftAddress,
    (ERC721ABI as ContractABI).abi,
    AccountService.getProvider()
  );
};
