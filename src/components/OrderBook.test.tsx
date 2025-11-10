import { render, screen } from '@testing-library/react'
import OrderBookDisplay from './OrderBook'
import { OrderBook } from '@/types'

const mockOrderBook: OrderBook = {
  lastUpdateId: 123,
  bids: [
    ['50000.00', '1.5'],
    ['49999.00', '2.0'],
    ['49998.00', '0.5']
  ],
  asks: [
    ['50001.00', '1.0'],
    ['50002.00', '1.5'],
    ['50003.00', '2.0']
  ]
}

describe('OrderBookDisplay', () => {
  it('renders order book with bids and asks', () => {
    render(<OrderBookDisplay orderBook={mockOrderBook} />)
    
    expect(screen.getByText('Order Book')).toBeInTheDocument()
    expect(screen.getByText('Price (USD)')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Total (USD)')).toBeInTheDocument()
  })

  it('displays mid-market price', () => {
    render(<OrderBookDisplay orderBook={mockOrderBook} />)
    
    expect(screen.getByText(/50000.50/)).toBeInTheDocument()
  })

  it('displays spread', () => {
    render(<OrderBookDisplay orderBook={mockOrderBook} />)
    
    expect(screen.getByText(/Spread:/)).toBeInTheDocument()
  })

  it('shows loading skeletons when isLoading is true', () => {
    render(<OrderBookDisplay orderBook={mockOrderBook} isLoading={true} />)
    
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows empty placeholder when order book is empty', () => {
    const emptyOrderBook: OrderBook = {
      lastUpdateId: 0,
      bids: [],
      asks: []
    }
    
    render(<OrderBookDisplay orderBook={emptyOrderBook} />)
    
    expect(screen.getByText('No Order Book Data')).toBeInTheDocument()
  })

  it('formats prices correctly', () => {
    render(<OrderBookDisplay orderBook={mockOrderBook} />)
    
    expect(screen.getByText('50000.00')).toBeInTheDocument()
    expect(screen.getByText('50001.00')).toBeInTheDocument()
  })

  it('displays bids and asks in correct order', () => {
    render(<OrderBookDisplay orderBook={mockOrderBook} />)
    
    const prices = screen.getAllByText(/5000[0-3]\.00/)
    expect(prices.length).toBeGreaterThan(0)
  })
})