import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.16",
      },
      {
        version: "0.8.0",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      metadata: {
        useLiteralContent: false,
        bytecodeHash: "ipfs",
      },
      outputSelection: {
        "*": {
          "*": [
            "evm.bytecode",
            "evm.deployedBytecode",
            "devdoc",
            "userdoc",
            "metadata",
            "abi",
          ],
        },
      },
      evmVersion: "london",
      libraries: {},
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.ETHERSCAN_API_KEY_BASE_SEPOLIA || "",
    },
  },
  networks: {
    base_sepolia: {
      url: process.env.RPC_ENDPOINT_BASE_SEPOLIA || "",
      gasPrice: 225000000000,
      chainId: 84532,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  }
};

export default config;
