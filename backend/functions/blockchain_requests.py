import os
from dotenv import load_dotenv
import requests
from moralis import evm_api
import json

load_dotenv()

MOBULA = os.getenv("MOBULA_KEY")
SIMPLEHASH = os.getenv("SIMPLEHASH_KEY")
MORALIS = os.getenv("MORALIS_KEY")

def fetch_ERC20_holdings_mobula(wallet: str, blockchains: str, cache: bool = True, stale: int = 300):
    url = f"https://api.mobula.io/api/1/wallet/portfolio?wallet={wallet}"
    if blockchains:
        url += f"&blockchains={blockchains}"
    url += f"&cache={str(cache).lower()}&stale={stale}"
    
    headers = {
        "Authorization": f"Bearer {MOBULA}"
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    assets_info = [
        {
            "asset": asset["asset"]["symbol"],
            "name": asset["asset"]["name"],
            "quantity": asset["token_balance"],
            "token_address": asset["asset"]["contracts"][0] if asset["asset"]["contracts"] else None
        }
        for asset in data.get("data", {}).get("assets", [])
    ]

    return assets_info

def fetch_NFT_holdings_simplehash(wallet: str, blockchains: str, limit: int = 50):
    url = f"https://api.simplehash.com/api/v0/nfts/owners?wallet_addresses={wallet}&limit={limit}"
    if blockchains:
        url += f"&chains={blockchains}"
    
    headers = {
        "X-API-KEY": SIMPLEHASH,
        "accept": "application/json"
    }

    response = requests.get(url, headers=headers)
    data = response.json()


    nft_info = [
        {
            "name": nft["name"],
            "quantity": nft["owners"][0]["quantity"],
            "image_url": nft["collection"]["image_url"],
            "token_address": nft["contract_address"]
        }
        for nft in data.get("nfts", [])
    ]

    return nft_info

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
