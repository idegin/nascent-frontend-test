import React, { useState } from 'react'
import { Asset, OrderBook } from './types'
import AssetSelector from './components/AssetSelector'
import OrderBookDisplay from './components/OrderBook'
import OrderEntryForm from './components/OrderEntryForm'

const mockBTCOrderbook: OrderBook = {
  lastUpdateId: 46507986938,
  bids: [
    ["60921.05", "3.41692"],
    ["60921.04", "0.00626"],
    ["60920.89", "0.00068"],
    ["60920.51", "0.07914"],
    ["60920.10", "0.00009"],
    ["60920.00", "0.20225"],
    ["60919.60", "0.02407"],
    ["60919.59", "0.04933"],
    ["60919.31", "0.00009"],
    ["60918.52", "0.00009"],
    ["60918.45", "0.04000"],
    ["60918.24", "0.00122"],
    ["60917.73", "0.00009"],
    ["60916.94", "0.00009"],
    ["60916.63", "0.00018"]
  ],
  asks: [
    ["60921.06", "3.31511"],
    ["60922.47", "0.00009"],
    ["60923.26", "0.00009"],
    ["60923.94", "0.20000"],
    ["60924.05", "0.00009"],
    ["60924.06", "0.01227"],
    ["60924.42", "0.30125"],
    ["60924.84", "0.00009"],
    ["60925.63", "0.00009"],
    ["60926.42", "0.00009"],
    ["60927.21", "0.00009"],
    ["60928.00", "0.00009"],
    ["60928.11", "0.40425"],
    ["60928.31", "0.29143"],
    ["60928.36", "0.00328"]
  ]
}

const mockETHOrderbook: OrderBook = {
  lastUpdateId: 32276864064,
  bids: [
    ["2996.79", "21.56010"],
    ["2996.74", "2.99900"],
    ["2996.71", "3.00000"],
    ["2996.65", "0.00190"],
    ["2996.61", "7.18170"],
    ["2996.60", "1.52790"],
    ["2996.59", "4.79400"],
    ["2996.58", "1.80940"],
    ["2996.57", "3.29510"],
    ["2996.55", "0.00190"],
    ["2996.54", "2.00000"],
    ["2996.53", "3.16290"],
    ["2996.52", "6.29510"],
    ["2996.50", "0.00190"],
    ["2996.49", "5.82730"]
  ],
  asks: [
    ["2996.80", "3.52790"],
    ["2996.82", "0.00640"],
    ["2996.85", "0.00190"],
    ["2996.90", "0.00190"],
    ["2996.92", "0.01680"],
    ["2996.95", "0.00190"],
    ["2996.96", "0.95260"],
    ["2996.99", "0.10000"],
    ["2997.00", "1.56120"],
    ["2997.04", "0.00290"],
    ["2997.05", "0.04120"],
    ["2997.06", "3.48720"],
    ["2997.07", "0.95500"],
    ["2997.08", "5.88240"],
    ["2997.10", "0.00190"]
  ]
}

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState<Asset>('BTC')

  const orderBookData: Record<Asset, OrderBook> = {
    BTC: mockBTCOrderbook,
    ETH: mockETHOrderbook
  }

  const currentOrderBook = orderBookData[selectedAsset]
  const bestBid = parseFloat(currentOrderBook.bids[0][0])
  const bestAsk = parseFloat(currentOrderBook.asks[0][0])
  const midPrice = (bestBid + bestAsk) / 2

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Crypto Trading</h1>
          <AssetSelector selectedAsset={selectedAsset} onAssetChange={setSelectedAsset} />
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrderBookDisplay orderBook={currentOrderBook} />
          </div>
          <div>
            <OrderEntryForm 
              asset={selectedAsset}
              midPrice={midPrice}
              bestBid={bestBid}
              bestAsk={bestAsk}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
