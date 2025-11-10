import { useState, useEffect } from 'react'
import { Asset, OrderSide, OrderType, Order } from '@/types'
import { Card, CardContent } from './ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { IconShoppingCart, IconInfoCircle } from '@tabler/icons-react'

interface OrderEntryFormProps {
  asset: Asset
  midPrice: number
  bestBid: number
  bestAsk: number
}

export default function OrderEntryForm({ asset, midPrice, bestBid, bestAsk }: OrderEntryFormProps) {
  const [side, setSide] = useState<OrderSide>('BUY')
  const [orderType, setOrderType] = useState<OrderType>('LIMIT')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notional, setNotional] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (orderType === 'LIMIT' && !price) {
      setPrice(midPrice.toFixed(2))
    }
  }, [midPrice, orderType, price])

  const handlePriceChange = (value: string) => {
    if (value === '' || !isNaN(parseFloat(value))) {
      setPrice(value)
      if (quantity && value) {
        const calculatedNotional = parseFloat(quantity) * parseFloat(value)
        setNotional(calculatedNotional.toFixed(2))
      }
    }
  }

  const handleQuantityChange = (value: string) => {
    if (value === '' || !isNaN(parseFloat(value))) {
      setQuantity(value)
      if (price && value) {
        const calculatedNotional = parseFloat(value) * parseFloat(price)
        setNotional(calculatedNotional.toFixed(2))
      }
    }
  }

  const handleNotionalChange = (value: string) => {
    if (value === '' || !isNaN(parseFloat(value))) {
      setNotional(value)
      if (price && value) {
        const calculatedQuantity = parseFloat(value) / parseFloat(price)
        setQuantity(calculatedQuantity.toFixed(8))
      }
    }
  }

  const handleQuickFill = (type: 'MID' | 'BID' | 'ASK') => {
    const priceValue = type === 'MID' ? midPrice : type === 'BID' ? bestBid : bestAsk
    setPrice(priceValue.toFixed(2))
    if (quantity) {
      const calculatedNotional = parseFloat(quantity) * priceValue
      setNotional(calculatedNotional.toFixed(2))
    }
  }

  const validateForm = () => {
    if (orderType === 'LIMIT' && (!price || parseFloat(price) <= 0)) {
      setMessage({ type: 'error', text: 'Price must be greater than 0' })
      return false
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      setMessage({ type: 'error', text: 'Quantity must be greater than 0' })
      return false
    }
    if (!notional || parseFloat(notional) <= 0) {
      setMessage({ type: 'error', text: 'Total must be greater than 0' })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    setMessage(null)
    
    if (!validateForm()) return

    setIsSubmitting(true)

    const order: Order = {
      asset,
      side,
      type: orderType,
      quantity: parseFloat(quantity),
      price: orderType === 'LIMIT' ? parseFloat(price) : undefined,
      notional: parseFloat(notional)
    }

    try {
      const response = await fetch('/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Order failed' })
      } else {
        setMessage({ type: 'success', text: `Order placed successfully! ID: ${data.id}` })
        setQuantity('')
        setNotional('')
        if (orderType === 'LIMIT') setPrice(midPrice.toFixed(2))
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <Tabs value={side} onValueChange={(value) => setSide(value as OrderSide)}>
          <TabsList className="w-full bg-secondary/30">
            <TabsTrigger value="BUY" className="flex-1">
              Buy
            </TabsTrigger>
            <TabsTrigger value="SELL" className="flex-1">
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={orderType} onValueChange={(value) => {
          setOrderType(value as OrderType)
          if (value === 'MARKET') {
            setPrice('')
          } else {
            setPrice(midPrice.toFixed(2))
          }
        }}>
          <TabsList className="w-full bg-secondary/20">
            <TabsTrigger value="LIMIT" className="flex-1">Limit</TabsTrigger>
            <TabsTrigger value="MARKET" className="flex-1">Market</TabsTrigger>
          </TabsList>

          <TabsContent value="LIMIT" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Limit Price</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="flex-1 font-mono"
                />
                <span className="flex items-center text-sm text-muted-foreground">USD</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => handleQuickFill('MID')} className="text-xs">
                  MID
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleQuickFill('BID')} className="text-xs">
                  BID
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleQuickFill('ASK')} className="text-xs">
                  ASK
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="MARKET" className="space-y-4 mt-4">
            <div className="p-3 bg-secondary/20 rounded-md border border-border/50">
              <div className="flex items-start gap-2">
                <IconInfoCircle className="size-4 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Market orders execute immediately at the best available price.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div>
          <label className="text-sm font-medium mb-2 block">Amount</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.00000000"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="flex-1 font-mono"
            />
            <span className="flex items-center text-sm text-muted-foreground">{asset}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Total</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.00"
              value={notional}
              onChange={(e) => handleNotionalChange(e.target.value)}
              className="flex-1 font-mono"
            />
            <span className="flex items-center text-sm text-muted-foreground">USD</span>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-md border ${
            message.type === 'success' 
              ? 'bg-primary/10 border-primary/50 text-primary' 
              : 'bg-destructive/10 border-destructive/50 text-destructive'
          }`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant={side === 'SELL' ? 'destructive' : 'default'}
          className="w-full h-11 font-semibold"
        >
          <IconShoppingCart className="size-4 mr-2" />
          {isSubmitting ? 'Submitting...' : `${side === 'BUY' ? 'Buy' : 'Sell'} ${asset}`}
        </Button>
      </CardContent>
    </Card>
  )
}
