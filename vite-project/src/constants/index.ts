import {ethers} from "ethers"
export { default as ERC20ABI} from "../abi/erc20.json"
export { default as ERC721ABI} from "../abi/nft.json"
export { default as WethArtifact } from '../abi/weth.json'
export { default as BundlerArtifact } from '../abi/bundler.json'

export const tokenSymbols = [
    "DAI",
    "PWNERC20",
    "WETH",
    "NFT",
    "ETH"
]

export const tokenInfos = {
    WETH: {
        address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        decimals: 18,
        name: 'Wrapped Ether',
        maxAllowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    },
    DAI: {
       address: "0x68194a729C2450ad26072b3D33ADaCbcef39D574",
       decimals : 18,
       name: "DAI",
       maxAllowance: "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    },
    PWN: {
        address: {
            sepolia: "0x83FA467e2E539bedaaFD23eAFf87Ff26Ed89A0f3",
            baseSepolia: "0x52B04a6112940BD3939D66693893A9e11c52A26C"
            },
        decimals : 18,
        name: "PWN",
        maxAllowance: "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    },
    NFT: {
        address: {
            sepolia:"0xa8830BF7469Ba944e6baCcAE6637eE95266926e5",
            baseSepolia: "0x5b691bc620d4636eF6ee1ff69b34C62bd72b7CA3"
    },
    ETH: {
        address: "0x0000000000000000000000000000000000000000", 
        decimals: 18,
        maxAllowance: "115792089237316195423570985008687907853269984665640564039457584007913129639935" 
      },
}
}

export const contracts = {
    BUNDLER: {
        address: {
            sepolia:"0x448E3D0a4BAa00FE511a03E7B27177AeDE6d9636",
            baseSepolia: "0xa8830BF7469Ba944e6baCcAE6637eE95266926e5",
            ethereum: "0x19e3293196aee99BB3080f28B9D3b4ea7F232b8d"
    },
    WRAPPEDETHER: {
        address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    },
    NFT: {
        address: {
            sepolia:"0xa8830BF7469Ba944e6baCcAE6637eE95266926e5",
            baseSepolia: "0x5b691bc620d4636eF6ee1ff69b34C62bd72b7CA3"
    },
}
}
}

export const GAS_LIMIT = ethers.toBeHex(1000000);