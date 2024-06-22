import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import TokenApprovalButton from "./TokenApprovalButton";
import { ERC20AssetsProps, TokenSymbol, ERC20AssetExtended } from "../../types/index";
import { Input}  from "@/components/ui/input"

  const ERC20Assets: React.FC<ERC20AssetsProps> = ({
    assets,
    truncateAddress,
    onSelectAsset,
    selectedAssets,
    chainId,
    quantities,
    onQuantityChange,
  }) => (
  <div>
    <h2 className="mt-4">ERC20 Assets</h2>
    <div className="flex flex-wrap gap-4">
    {assets.map((asset: ERC20AssetExtended, index: number) => {
        const isSelected = selectedAssets.some(
          (a) => a.token_address === asset.token_address && a.type === "ERC20"
        );
        return (
          <Card
            key={index}
            className={`w-[350px] hover:shadow-2xl hover:scale-105 transition-shadow duration-300 ${
              isSelected ? "border-2 border-green-500 bg-green-100" : ""
            }`}
            onClick={() => onSelectAsset(asset)}
          >
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
              <CardDescription>Symbol: {asset.symbol}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Address: {truncateAddress(asset.token_address || "")}</p>
              <p>Blockchain: {asset.blockchain}</p>
              <p>Quantity: {asset.quantity}</p>
              <Input
                type="number"
                value={quantities[asset.token_address || ''] || ''}
                onChange={(e) => onQuantityChange(asset.token_address || '', e.target.value)}
                placeholder="Enter quantity"
                className="mt-2 p-1 border rounded"
              />
              <p>Price: {asset.asset_price}</p>
              {asset.image_url && (
                <img src={asset.image_url} alt={asset.name} width="50" />
              )}
              <TokenApprovalButton symbol={asset.symbol as TokenSymbol} chainId={chainId} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default ERC20Assets;