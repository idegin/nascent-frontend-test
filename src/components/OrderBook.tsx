import { OrderBook } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'
import SectionPlaceholder from './SectionPlaceholder'
import { IconArrowDown } from '@tabler/icons-react'

interface OrderBookProps {
    orderBook: OrderBook
    isLoading?: boolean
}

export default function OrderBookDisplay({ orderBook, isLoading = false }: OrderBookProps) {
    const formatPrice = (price: string) => parseFloat(price).toFixed(2)
    const formatQuantity = (qty: string) => parseFloat(qty).toFixed(4)

    const bestBid = orderBook.bids[0] ? parseFloat(orderBook.bids[0][0]) : 0
    const bestAsk = orderBook.asks[0] ? parseFloat(orderBook.asks[0][0]) : 0
    const midPrice = (bestBid + bestAsk) / 2
    const spread = bestAsk - bestBid
    const spreadPercent = (spread / midPrice) * 100

    const calculateTotal = (entries: [string, string][], idx: number) => {
        return entries
            .slice(0, idx + 1)
            .reduce((sum, [, qty]) => sum + parseFloat(qty), 0)
    }

    const maxTotal = Math.max(
        calculateTotal(orderBook.bids, orderBook.bids.length - 1),
        calculateTotal(orderBook.asks, orderBook.asks.length - 1)
    )

    const isEmpty = !isLoading && orderBook.bids.length === 0 && orderBook.asks.length === 0

    if (isEmpty) {
        return (
            <SectionPlaceholder
                type="empty"
                title="No Order Book Data"
                description="There is currently no order book data available for this asset. Please try again later or select a different asset."
                actionLabel="Refresh"
                onAction={() => window.location.reload()}
            />
        )
    }

    return (
        <Card className="border-border/50 shadow-lg">
            <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                    Order Book
                </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground pb-3 px-3 border-b border-border/50">
                    <div>Price (USD)</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Total (USD)</div>
                </div>

                {isLoading ? (
                    <div className="space-y-3 py-4 px-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-3 gap-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16 ml-auto" />
                                <Skeleton className="h-4 w-24 ml-auto" />
                            </div>
                        ))}
                        <Skeleton className="h-16 w-full my-4" />
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-3 gap-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16 ml-auto" />
                                <Skeleton className="h-4 w-24 ml-auto" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="max-h-[600px] overflow-y-auto">
                        <div className="space-y-0.5 py-2">
                            {[...orderBook.asks].reverse().map(([price, qty], idx) => {
                                const originalIdx = orderBook.asks.length - 1 - idx
                                const total = calculateTotal(orderBook.asks, originalIdx)
                                const percentage = (total / maxTotal) * 100
                                return (
                                    <div key={`ask-${idx}`} className="relative group">
                                        <div
                                            className="absolute inset-0 bg-red-500/10 dark:bg-red-400/10 rounded"
                                            style={{ width: `${percentage}%` }}
                                        />
                                        <div className="relative grid grid-cols-3 gap-2 text-sm hover:bg-accent/30 px-3 py-1.5 rounded transition-colors cursor-pointer">
                                            <div className="text-red-600 dark:text-red-400 font-mono font-semibold">{formatPrice(price)}</div>
                                            <div className="text-right font-mono text-foreground">{formatQuantity(qty)}</div>
                                            <div className="text-right font-mono text-muted-foreground text-xs">{formatPrice((parseFloat(price) * parseFloat(qty)).toString())}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="sticky top-0 bottom-0 z-10 my-3 p-4 bg-primary/50 backdrop-blur-sm rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-mono font-bold">{midPrice.toFixed(2)}</span>
                                    <IconArrowDown className="size-4 text-muted-foreground" />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Spread: {spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)
                                </div>
                            </div>
                        </div>

                        <div className="space-y-0.5 py-2">
                            {orderBook.bids.map(([price, qty], idx) => {
                                const total = calculateTotal(orderBook.bids, idx)
                                const percentage = (total / maxTotal) * 100
                                return (
                                    <div key={`bid-${idx}`} className="relative group">
                                        <div
                                            className="absolute inset-0 bg-green-500/10 dark:bg-green-400/10 rounded"
                                            style={{ width: `${percentage}%` }}
                                        />
                                        <div className="relative grid grid-cols-3 gap-2 text-sm hover:bg-accent/30 px-3 py-1.5 rounded transition-colors cursor-pointer">
                                            <div className="text-green-600 dark:text-green-400 font-mono font-semibold">{formatPrice(price)}</div>
                                            <div className="text-right font-mono text-foreground">{formatQuantity(qty)}</div>
                                            <div className="text-right font-mono text-muted-foreground text-xs">{formatPrice((parseFloat(price) * parseFloat(qty)).toString())}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
