# Frontend

This frontend is developed with React and structured with the following folders:

## Project Structure

### `abi`
Contains the ABIs for ERC20, ERC721, and the TokenBundler contract.

### `components`
- `ui`: Pre-built components using Shadcn.
- Other components: Used for landing pages, buttons, and approval components.

### `constants`
Stores project-wide constants.

### `hooks`
Houses custom React hooks.

### `pages`
Contains the main application pages.

### `services`
Includes:
- Web3 wallet (Metamask) integration
- Contract interactions
- Approval processes

### `types`
Defines TypeScript types and interfaces.

### `utils`
Contains utility functions and helper methods.

## Features

- Metamask wallet connection
- Display of owned assets with balances
- Asset bundling functionality
- Asset refresh and invalidation
- Real-time balance updates after wrapping
- Contract interactions for bundling and unbundling

## Supported Networks

- Base Sepolia and Sepolia: Full contract interactions
- Ethereum Mainnet: Asset display only

## Future Enhancements

- Multi-network support
- Asset price display
- Asset unbundling feature

## Notice
This frontend currently allows interactions only with specific ERC20 and ERC721 tokens. On Sepolia, it supports PWN and DAI (ERC20), as well as PWN (ERC721). On Base Sepolia, it supports only PWN (ERC20) and PWN (ERC721). ETH wrapping and related interactions are not yet implemented.
