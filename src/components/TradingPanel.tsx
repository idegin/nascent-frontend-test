import { Asset, Order } from '@/types'
import OrderEntryForm from './OrderEntryForm'

interface TradingPanelProps {
    asset: Asset
    midPrice: number
    bestBid: number
    bestAsk: number
    onSubmitOrder: (order: Order) => Promise<void>
    isLoading?: boolean
}

export default function TradingPanel({ asset, midPrice, bestBid, bestAsk, onSubmitOrder, isLoading = false }: TradingPanelProps) {
    return (
        <div>
            <OrderEntryForm
                asset={asset}
                midPrice={midPrice}
                bestBid={bestBid}
                bestAsk={bestAsk}
                onSubmit={onSubmitOrder}
                isLoading={isLoading}
            />
        </div>
    )
}
