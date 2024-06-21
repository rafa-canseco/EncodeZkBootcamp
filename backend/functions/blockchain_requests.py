import os
from dotenv import load_dotenv
import requests
from moralis import evm_api
import json

load_dotenv()

MOBULA = os.getenv("MOBULA_KEY")
SIMPLEHASH = os.getenv("SIMPLEHASH_KEY")
MORALIS = os.getenv("MORALIS_KEY")

def fetch_erc20_holdings_moralis(wallet, blockchain):
    params = {
        "chain": blockchain,
        "address": wallet
    }

    result = evm_api.wallets.get_wallet_token_balances_price(
        api_key=MORALIS,
        params=params
    )

    assets_info = [
        {
            "asset": asset["symbol"],
            "name": asset["name"],
            "quantity": asset["balance_formatted"],
            "token_address": asset["token_address"],
            "asset_price": asset["usd_price"]
        }
        for asset in result.get("result", [])
    ]

    return assets_info

def fetch_NFT_holdings_moralis(wallet, blockchain):
    params = {
        "chain": blockchain,
        "format": "decimal",
        "media_items": True,
        "address": wallet
    }
    
    result = evm_api.nft.get_wallet_nfts(
        api_key=MORALIS,
        params=params
    )
    

    nft_info = []
    for nft in result.get("result", []):
        metadata = nft.get("metadata")
        if isinstance(metadata, str):
            metadata = json.loads(metadata)
            
        nft_info.append({
            "name": nft.get("name"),
            "quantity": nft.get("amount"),
            "image_url": metadata.get("image") if metadata else None,
            "token_address": nft.get("token_address"),
            "token_id": nft.get("token_id")
        })

    return nft_info

