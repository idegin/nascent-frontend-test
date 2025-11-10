import React, { useState, useEffect } from 'react'
import { Asset, OrderBook, Order } from './types'
import AssetSelector from './components/AssetSelector'
import OrderBookDisplay from './components/OrderBook'
import TradingPanel from './components/TradingPanel'
import SectionPlaceholder from './components/SectionPlaceholder'
import { getOrderbook, sendTrade } from './api/api'

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState<Asset>('BTC')
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderbook = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getOrderbook(selectedAsset)
        setOrderBook(data)
      } catch (error) {
        console.error('Failed to fetch orderbook:', error)
        setError(error instanceof Error ? error.message : 'Failed to load orderbook data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderbook()
  }, [selectedAsset])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    window.location.reload()
  }

  const handleSubmitOrder = async (order: Order) => {
    await sendTrade(order)
  }

  const bestBid = orderBook ? parseFloat(orderBook.bids[0][0]) : 0
  const bestAsk = orderBook ? parseFloat(orderBook.asks[0][0]) : 0
  const midPrice = (bestBid + bestAsk) / 2

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Crypto Trading</h1>
          <AssetSelector selectedAsset={selectedAsset} onAssetChange={setSelectedAsset} />
        </header>

        {error ? (
          <SectionPlaceholder
            type="error"
            title="Failed to Load Data"
            description={error}
            actionLabel="Retry"
            onAction={handleRetry}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OrderBookDisplay
                orderBook={orderBook || { lastUpdateId: 0, bids: [], asks: [] }}
                isLoading={isLoading}
              />
            </div>
            <div>
              <TradingPanel
                asset={selectedAsset}
                midPrice={midPrice}
                bestBid={bestBid}
                bestAsk={bestAsk}
                onSubmitOrder={handleSubmitOrder}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
