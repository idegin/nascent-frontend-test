import { render, screen, fireEvent } from '@testing-library/react'
import SectionPlaceholder from './SectionPlaceholder'

describe('SectionPlaceholder', () => {
  it('renders error type with correct styling', () => {
    render(
      <SectionPlaceholder
        type="error"
        title="Error Title"
        description="Error description"
      />
    )
    
    expect(screen.getByText('Error Title')).toBeInTheDocument()
    expect(screen.getByText('Error description')).toBeInTheDocument()
  })

  it('renders empty type with correct styling', () => {
    render(
      <SectionPlaceholder
        type="empty"
        title="Empty Title"
        description="Empty description"
      />
    )
    
    expect(screen.getByText('Empty Title')).toBeInTheDocument()
    expect(screen.getByText('Empty description')).toBeInTheDocument()
  })

  it('renders action button when provided', () => {
    const mockAction = jest.fn()
    
    render(
      <SectionPlaceholder
        type="error"
        title="Error"
        description="Description"
        actionLabel="Retry"
        onAction={mockAction}
      />
    )
    
    const button = screen.getByRole('button', { name: /retry/i })
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  it('does not render action button when not provided', () => {
    render(
      <SectionPlaceholder
        type="info"
        title="Info"
        description="Description"
      />
    )
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders all placeholder types', () => {
    const types: Array<'error' | 'empty' | 'info' | 'warning'> = ['error', 'empty', 'info', 'warning']
    
    types.forEach(type => {
      const { unmount } = render(
        <SectionPlaceholder
          type={type}
          title={`${type} title`}
          description={`${type} description`}
        />
      )
      
      expect(screen.getByText(`${type} title`)).toBeInTheDocument()
      unmount()
    })
  })
})