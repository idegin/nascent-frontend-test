import { render, screen, fireEvent } from '@testing-library/react'
import AssetSelector from './AssetSelector'
import { Asset } from '@/types'

describe('AssetSelector', () => {
  it('renders Bitcoin and Ethereum options', () => {
    const mockOnChange = jest.fn()
    
    render(
      <AssetSelector
        selectedAsset="BTC"
        onAssetChange={mockOnChange}
      />
    )
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
  })

  it('calls onAssetChange when Bitcoin is selected', () => {
    const mockOnChange = jest.fn()
    
    render(
      <AssetSelector
        selectedAsset="ETH"
        onAssetChange={mockOnChange}
      />
    )
    
    const btcTab = screen.getByRole('tab', { name: /bitcoin/i })
    fireEvent.click(btcTab)
    
    expect(mockOnChange).toHaveBeenCalledWith('BTC')
  })

  it('calls onAssetChange when Ethereum is selected', () => {
    const mockOnChange = jest.fn()
    
    render(
      <AssetSelector
        selectedAsset="BTC"
        onAssetChange={mockOnChange}
      />
    )
    
    const ethTab = screen.getByRole('tab', { name: /ethereum/i })
    fireEvent.click(ethTab)
    
    expect(mockOnChange).toHaveBeenCalledWith('ETH')
  })

  it('displays selected asset correctly', () => {
    const mockOnChange = jest.fn()
    
    const { rerender } = render(
      <AssetSelector
        selectedAsset="BTC"
        onAssetChange={mockOnChange}
      />
    )
    
    expect(screen.getByRole('tab', { name: /bitcoin/i })).toHaveAttribute('data-state', 'active')
    
    rerender(
      <AssetSelector
        selectedAsset="ETH"
        onAssetChange={mockOnChange}
      />
    )
    
    expect(screen.getByRole('tab', { name: /ethereum/i })).toHaveAttribute('data-state', 'active')
  })
})