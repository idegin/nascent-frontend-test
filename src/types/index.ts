export type Asset = 'BTC' | 'ETH'

export type OrderBookEntry = [string, string]

export interface OrderBook {
  lastUpdateId: number
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'LIMIT' | 'MARKET'

export interface Order {
  asset: Asset
  side: OrderSide
  type: OrderType
  quantity: number
  price?: number
  notional: number
}

export interface TradeResponse extends Order {
  id: string
  timestamp: number
}
