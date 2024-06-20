import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TokenApprovalButton from "./TokenApprovalButton";

const ERC20Assets = ({ assets, truncateAddress, onSelectAsset, selectedAssets, walletAddress }) => (
  <div>
    <h2 className="mt-4">ERC20 Assets</h2>
    <div className="flex flex-wrap gap-4">
      {assets.map((asset, index) => {
        const isSelected = selectedAssets.includes(asset);
        return (
          <Card
            key={index}
            className={`w-[350px] hover:shadow-2xl hover:scale-105 transition-shadow duration-300 ${isSelected ? 'border-2 border-green-500 bg-green-100' : ''}`}
            onClick={() => onSelectAsset(asset)}
          >
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
              <CardDescription>Symbol: {asset.symbol}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Dirección: {truncateAddress(asset.token_address)}</p>
              <p>Blockchain: {asset.blockchain}</p>
              <p>Cantidad: {asset.quantity}</p>
              {asset.image_url && (
                <img src={asset.image_url} alt={asset.name} width="50" />
              )}
              <TokenApprovalButton symbol={asset.symbol} spenderAddress={walletAddress} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default ERC20Assets;