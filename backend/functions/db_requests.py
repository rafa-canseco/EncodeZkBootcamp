import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

def check_table_exists(address: str, blockchain: str) -> bool:
    response = supabase.table("addresses").select("*").eq("address", address).eq("blockchain", blockchain).execute()
    return len(response.data) > 0

def create_address_table(address: str, blockchain: str):
    supabase.table("addresses").insert({"address": address, "blockchain": blockchain}).execute()

def delete_erc20_assets(address: str, blockchain: str):
    supabase.table("erc20_assets").delete().eq("address", address).eq("blockchain", blockchain).execute()

def delete_nft_assets(address: str, blockchain: str):
    supabase.table("nft_assets").delete().eq("address", address).eq("blockchain", blockchain).execute()

def save_erc20_assets(address: str, blockchain: str, erc20_assets: list):
    for asset in erc20_assets:
        supabase.table("erc20_assets").insert({
            "address": address,
            "blockchain": blockchain,
            "symbol": asset["asset"],
            "name": asset["name"],
            "quantity": asset["quantity"]
        }).execute()

def save_nft_assets(address: str, blockchain: str, nft_assets: list):
    for asset in nft_assets:
        supabase.table("nft_assets").insert({
            "address": address,
            "blockchain": blockchain,
            "name": asset["name"],
            "quantity": asset["quantity"],
            "image_url": asset["image_url"]
        }).execute()