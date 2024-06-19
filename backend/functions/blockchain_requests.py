import os
from dotenv import load_dotenv
import requests

load_dotenv()

MOBULA = os.getenv("MOBULA_KEY")
SIMPLEHASH = os.getenv("SIMPLEHASH_KEY")

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

    # Extraer solo el asset, el nombre del asset y la cantidad
    assets_info = [
        {
            "asset": asset["asset"]["symbol"],
            "name": asset["asset"]["name"],
            "quantity": asset["token_balance"]
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

    # Extraer solo el nombre, la cantidad y la URL de la imagen
    nft_info = [
        {
            "name": nft["name"],
            "quantity": nft["owners"][0]["quantity"],
            "image_url": nft["collection"]["image_url"]
        }
        for nft in data.get("nfts", [])
    ]

    return nft_info
