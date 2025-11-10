import { Asset, OrderBook, Order } from '../types'

export const getOrderbook = async (asset: Asset): Promise<OrderBook> => {
  const response = await fetch(`/orderbook/${asset}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch orderbook')
  }
  
  return response.json()
}

export const sendTrade = async (order: Order): Promise<void> => {
  const response = await fetch('/trade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Order failed')
  }
}