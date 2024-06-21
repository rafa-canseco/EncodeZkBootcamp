import {ethers} from "hardhat"
import * as dotenv from "dotenv"
import {  TokenBundler__factory } from "../typechain-types"
const hre = require("hardhat")
dotenv.config()

function setUpProvider(){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_BASE_SEPOLIA ?? "")
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)
    return {provider, wallet}
}

async function main() {
    const {provider, wallet} = setUpProvider()
    console.log("deploying contract");

    const TokenBundlerFactory = new TokenBundler__factory(wallet)
    const tokenBundler = await TokenBundlerFactory.deploy(process.env.TOKEN_BUNDLER_METADATA_URI ?? "")
    const deploymentTransaction = tokenBundler.deploymentTransaction()
    const receipt = await deploymentTransaction?.wait(5)
    await tokenBundler.waitForDeployment()
    console.log("contract deployed")
    const contractAddress = await tokenBundler.getAddress()
    console.log("contract address", contractAddress)
    console.log("verifying Contract")
        const confirmationsNeeded = 5;
        const currentBlockNumber = await provider.getBlockNumber();
        if (currentBlockNumber - receipt.blockNumber < confirmationsNeeded) {
            const additionalBlocksToWait = confirmationsNeeded - (currentBlockNumber - receipt.blockNumber);
            console.log(`Waiting for ${additionalBlocksToWait} more confirmations...`);
            while (await provider.getBlockNumber() - receipt.blockNumber < confirmationsNeeded) {
                await new Promise(resolve => setTimeout(resolve, 15000)); 
            }
        }
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [process.env.TOKEN_BUNDLER_METADATA_URI ?? ""],
        }),
        console.log("Contract Verified")
    } catch (error) {
        console.log("Error verifying Contract",error)
    }


}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});