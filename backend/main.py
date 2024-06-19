from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
from functions.blockchain_requests import fetch_NFT_holdings_simplehash, fetch_ERC20_holdings_mobula
from functions.db_requests import create_address_table, save_erc20_assets, save_nft_assets, check_table_exists, delete_erc20_assets, delete_nft_assets
import os

# Initiate App
app = FastAPI()

# CORS - Origins
origins = ["*"]

# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

load_dotenv()

# Supabase
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

# Check Health
@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/manage_assets")
async def manage_assets(data: dict):
    address = data["address"]
    blockchains = data["blockchains"]
    
    all_erc20_assets = []
    all_nft_assets = []
    
    for blockchain in blockchains:
        erc20_assets = fetch_ERC20_holdings_mobula(address, blockchain)
        nft_assets = fetch_NFT_holdings_simplehash(address, blockchain)
        
        if not check_table_exists(address, blockchain):
            create_address_table(address, blockchain)
        
        delete_erc20_assets(address, blockchain)
        delete_nft_assets(address, blockchain)
        
        save_erc20_assets(address, blockchain, erc20_assets)
        save_nft_assets(address, blockchain, nft_assets)
        
        all_erc20_assets.extend(erc20_assets)
        all_nft_assets.extend(nft_assets)
    
    return {"status": "assets_managed", "erc20_assets": all_erc20_assets, "nft_assets": all_nft_assets}

@app.get("/get_assets")
async def get_assets(address: str, blockchain: str):
    erc20_assets = supabase.table("erc20_assets").select("*").eq("address", address).eq("blockchain", blockchain).execute().data
    nft_assets = supabase.table("nft_assets").select("*").eq("address", address).eq("blockchain", blockchain).execute().data
    return {"erc20_assets": erc20_assets, "nft_assets": nft_assets}