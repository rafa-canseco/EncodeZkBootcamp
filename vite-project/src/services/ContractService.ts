import { ethers } from "ethers";
import { ERC20ABI, BundlerArtifact, ERC721ABI } from "../constants";
import AccountService from "./AccountService";
import { ContractABI } from "../types/index";

// Creates and returns a new ethers Contract instance for the Bundler
export const getBundler = (bundlerAddress: string): ethers.Contract => {
  return new ethers.Contract(
    bundlerAddress,
    (BundlerArtifact as ContractABI).abi,
    AccountService.getProvider()
  );
};

// Creates and returns a new ethers Contract instance for an ERC20 token
export const getToken = (address: string): ethers.Contract => {
  return new ethers.Contract(
    address,
    (ERC20ABI as ContractABI).abi,
    AccountService.getProvider()
  );
};

// Creates and returns a new ethers Contract instance for an ERC721 NFT
export const getNft = (nftAddress: string): ethers.Contract => {
  return new ethers.Contract(
    nftAddress,
    (ERC721ABI as ContractABI).abi,
    AccountService.getProvider()
  );
};
