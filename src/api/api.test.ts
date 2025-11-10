import { getOrderbook, sendTrade } from './api'
import { Asset, Order } from '../types'

global.fetch = jest.fn()

describe('API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getOrderbook', () => {
    it('fetches orderbook for BTC', async () => {
      const mockOrderBook = {
        lastUpdateId: 123,
        bids: [['50000', '1.0']],
        asks: [['50001', '1.0']]
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrderBook
      })

      const result = await getOrderbook('BTC')

      expect(fetch).toHaveBeenCalledWith('/orderbook/BTC')
      expect(result).toEqual(mockOrderBook)
    })

    it('fetches orderbook for ETH', async () => {
      const mockOrderBook = {
        lastUpdateId: 456,
        bids: [['3000', '2.0']],
        asks: [['3001', '2.0']]
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrderBook
      })

      const result = await getOrderbook('ETH')

      expect(fetch).toHaveBeenCalledWith('/orderbook/ETH')
      expect(result).toEqual(mockOrderBook)
    })

    it('throws error when fetch fails', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      })

      await expect(getOrderbook('BTC')).rejects.toThrow('Failed to fetch orderbook')
    })
  })

  describe('sendTrade', () => {
    it('sends buy order successfully', async () => {
      const order: Order = {
        asset: 'BTC',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 1.5,
        price: 50000,
        notional: 75000
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      await sendTrade(order)

      expect(fetch).toHaveBeenCalledWith('/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
    })

    it('sends sell order successfully', async () => {
      const order: Order = {
        asset: 'ETH',
        side: 'SELL',
        type: 'LIMIT',
        quantity: 2.0,
        price: 3000,
        notional: 6000
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      await sendTrade(order)

      expect(fetch).toHaveBeenCalledWith('/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
    })

    it('throws error when order fails', async () => {
      const order: Order = {
        asset: 'BTC',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 1,
        price: 50000,
        notional: 50000
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid order' })
      })

      await expect(sendTrade(order)).rejects.toThrow('Invalid order')
    })

    it('throws generic error when no error message provided', async () => {
      const order: Order = {
        asset: 'BTC',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 1,
        price: 50000,
        notional: 50000
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      })

      await expect(sendTrade(order)).rejects.toThrow('Order failed')
    })
  })
})