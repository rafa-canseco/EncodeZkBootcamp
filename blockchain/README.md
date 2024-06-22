# TokenBundler Deployment

This project deploys the TokenBundler contract created by PWNDao using Hardhat.

## Deployment Instructions

The contract is currently configured to deploy on Base Sepolia. To deploy, follow these steps:

1. Compile the contract:
   ```
   bun hardhat compile
   ```

2. Deploy and verify the contract:
   ```
   bun hardhat run scripts/deploy.ts --network baseSepolia
   ```

This process will deploy the contract and automatically verify it on the network.

## Deployed Contract

The TokenBundler is deployed on:

- Base Sepolia: [`0xD8bb0daC79c89C4B71fA2bb0930b5b005d071169`](https://sepolia.basescan.org/address/0xd8bb0dac79c89c4b71fa2bb0930b5b005d071169)
