import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderEntryForm from './OrderEntryForm'
import { Order } from '@/types'

describe('OrderEntryForm', () => {
  const mockOnSubmit = jest.fn()
  const defaultProps = {
    asset: 'BTC' as const,
    midPrice: 50000,
    bestBid: 49999,
    bestAsk: 50001,
    onSubmit: mockOnSubmit,
    isLoading: false
  }

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders order entry form with all fields', () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    expect(screen.getByText('Order Entry')).toBeInTheDocument()
    expect(screen.getByText('Buy')).toBeInTheDocument()
    expect(screen.getByText('Sell')).toBeInTheDocument()
    expect(screen.getByText('Limit Price')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('initializes with mid price', () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    const priceInput = screen.getAllByRole('textbox')[0]
    expect(priceInput).toHaveValue('50000.00')
  })

  it('switches between Buy and Sell tabs', () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    const sellTab = screen.getByRole('tab', { name: /sell/i })
    fireEvent.click(sellTab)
    
    expect(screen.getByRole('button', { name: /sell btc/i })).toBeInTheDocument()
  })

  it('auto-calculates notional when price and quantity are entered', async () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    const inputs = screen.getAllByRole('textbox')
    const priceInput = inputs[0]
    const quantityInput = inputs[1]
    
    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, '50000')
    
    await userEvent.type(quantityInput, '2')
    
    await waitFor(() => {
      const notionalInput = inputs[2]
      expect(notionalInput).toHaveValue('100000.00')
    })
  })

  it('auto-calculates quantity when price and notional are entered', async () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    const inputs = screen.getAllByRole('textbox')
    const priceInput = inputs[0]
    const notionalInput = inputs[2]
    
    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, '50000')
    
    await userEvent.type(notionalInput, '100000')
    
    await waitFor(() => {
      const quantityInput = inputs[1]
      expect(quantityInput).toHaveValue('2.00000000')
    })
  })

  it('fills price with MID button click', async () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    const midButton = screen.getByRole('button', { name: /mid/i })
    fireEvent.click(midButton)
    
    const priceInput = screen.getAllByRole('textbox')[0]
    expect(priceInput).toHaveValue('50000.00')
  })

  it('fills price with BID button click', async () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    const bidButton = screen.getByRole('button', { name: /bid/i })
    fireEvent.click(bidButton)
    
    const priceInput = screen.getAllByRole('textbox')[0]
    expect(priceInput).toHaveValue('49999.00')
  })

  it('fills price with ASK button click', async () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    const askButton = screen.getByRole('button', { name: /ask/i })
    fireEvent.click(askButton)
    
    const priceInput = screen.getAllByRole('textbox')[0]
    expect(priceInput).toHaveValue('50001.00')
  })

  it('shows validation error for invalid quantity', async () => {
    render(<OrderEntryForm {...defaultProps} />)
    
    const inputs = screen.getAllByRole('textbox')
    const quantityInput = inputs[1]
    
    await userEvent.type(quantityInput, '-1')
    
    await waitFor(() => {
      expect(screen.getByText(/quantity must be greater than 0/i)).toBeInTheDocument()
    })
  })

  it('submits order with correct data', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined)
    
    render(<OrderEntryForm {...defaultProps} />)
    
    const inputs = screen.getAllByRole('textbox')
    const quantityInput = inputs[1]
    
    await userEvent.type(quantityInput, '2')
    
    const submitButton = screen.getByRole('button', { name: /buy btc/i })
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
    
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        asset: 'BTC',
        side: 'BUY',
        type: 'LIMIT',
        price: 50000,
        quantity: 2,
        notional: 100000
      })
    })
  })

  it('shows success message after successful submission', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined)
    
    render(<OrderEntryForm {...defaultProps} />)
    
    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[1], '1')
    
    const submitButton = screen.getByRole('button', { name: /buy btc/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/order placed successfully/i)).toBeInTheDocument()
    })
  })

  it('shows error message after failed submission', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('Order failed'))
    
    render(<OrderEntryForm {...defaultProps} />)
    
    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[1], '1')
    
    const submitButton = screen.getByRole('button', { name: /buy btc/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/order failed/i)).toBeInTheDocument()
    })
  })

  it('shows loading skeletons when isLoading is true', () => {
    render(<OrderEntryForm {...defaultProps} isLoading={true} />)
    
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('disables submit button while submitting', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<OrderEntryForm {...defaultProps} />)
    
    const inputs = screen.getAllByRole('textbox')
    await userEvent.type(inputs[1], '1')
    
    const submitButton = screen.getByRole('button', { name: /buy btc/i })
    fireEvent.click(submitButton)
    
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/submitting/i)).toBeInTheDocument()
  })
})