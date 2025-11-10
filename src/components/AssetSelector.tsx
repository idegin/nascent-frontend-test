import { Asset } from '@/types'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { IconCurrencyBitcoin, IconCurrencyEthereum } from '@tabler/icons-react'

interface AssetSelectorProps {
  selectedAsset: Asset
  onAssetChange: (asset: Asset) => void
}

export default function AssetSelector({ selectedAsset, onAssetChange }: AssetSelectorProps) {
  return (
    <Tabs value={selectedAsset} onValueChange={(value) => onAssetChange(value as Asset)}>
      <TabsList className="bg-secondary/30 border border-border">
        <TabsTrigger value="BTC">
          <IconCurrencyBitcoin className="size-4" />
          Bitcoin
        </TabsTrigger>
        <TabsTrigger value="ETH">
          <IconCurrencyEthereum className="size-4" />
          Ethereum
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
