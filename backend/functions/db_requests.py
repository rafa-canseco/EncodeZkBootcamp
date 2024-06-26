import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

def check_table_exists(address: str, blockchain: str) -> bool:
    """
    Check if an address exists in the 'addresses' table for a given blockchain.
    """
    response = supabase.table("addresses").select("*").eq("address", address).eq("blockchain", blockchain).execute()
    return len(response.data) > 0

def create_address_table(address: str, blockchain: str):
    """
    Create a new entry in the 'addresses' table for a given address and blockchain.
    """
    supabase.table("addresses").insert({"address": address, "blockchain": blockchain}).execute()

def delete_erc20_assets(address: str, blockchain: str):
    """
    Delete all ERC20 assets for a given address and blockchain.
    """
    supabase.table("erc20_assets").delete().eq("address", address).eq("blockchain", blockchain).execute()

def delete_nft_assets(address: str, blockchain: str):
    """
    Delete all NFT assets for a given address and blockchain.
    """
    supabase.table("nft_assets").delete().eq("address", address).eq("blockchain", blockchain).execute()

def save_erc20_assets(address: str, blockchain: str, erc20_assets: list):
    """
    Save ERC20 assets for a given address and blockchain.
    """
    for asset in erc20_assets:
        supabase.table("erc20_assets").insert({
            "address": address,
            "blockchain": blockchain,
            "symbol": asset["asset"],
            "name": asset["name"],
            "quantity": asset["quantity"],
            "token_address": asset["token_address"],
            "asset_price": asset["asset_price"] if asset["asset_price"] is not None else 0
        }).execute()

def save_nft_assets(address: str, blockchain: str, nft_assets: list):
    """
    Save NFT assets for a given address and blockchain.
    """
    for asset in nft_assets:
        supabase.table("nft_assets").insert({
            "address": address,
            "blockchain": blockchain,
            "name": asset["name"] if asset["name"] is not None else "",
            "quantity": asset["quantity"] if asset["quantity"] is not None else 0,
            "image_url": asset["image_url"] if asset["image_url"] is not None else "",
            "token_address": asset["token_address"] if asset["token_address"] is not None else "",
            "token_id": asset["token_id"] if asset.get("token_id") is not None else ""
        }).execute()

