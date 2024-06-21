import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import NftApprovalButton from "./NftApprovalButton";
import { NFTAssetsProps } from "../../types/index";

const NFTAssets: React.FC<NFTAssetsProps> = ({
  assets,
  truncateAddress,
  onSelectAsset,
  selectedAssets,
  chainId,
}) => (
  <div>
    <h2 className="mt-4">NFT Assets</h2>
    <div className="flex flex-wrap gap-4">
      {assets.map((asset, index) => {
        const isSelected = selectedAssets.some(
          (a) =>
            a.token_address === asset.token_address &&
            a.token_id === asset.token_id &&
            a.type === "NFT"
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
              <CardDescription>ID: {asset.token_id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Address:{" "}
                {asset.token_address
                  ? truncateAddress(asset.token_address)
                  : "N/A"}
              </p>
              <p>Blockchain: {asset.blockchain}</p>
              <p>Quantity: {asset.quantity}</p>
              {asset.image_url && (
                <img src={asset.image_url} alt={asset.name} width="50" />
              )}
              <NftApprovalButton tokenId={asset.token_id} chainId={chainId} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default NFTAssets;
