import { ReactNode } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { 
  IconAlertCircle, 
  IconInfoCircle, 
  IconInbox, 
  IconAlertTriangle 
} from '@tabler/icons-react'

type PlaceholderType = 'error' | 'empty' | 'info' | 'warning'

interface SectionPlaceholderProps {
  type: PlaceholderType
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

const typeConfig: Record<PlaceholderType, { 
  icon: ReactNode
  iconColor: string
  bgColor: string
}> = {
  error: {
    icon: <IconAlertCircle className="size-12" />,
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive/10'
  },
  empty: {
    icon: <IconInbox className="size-12" />,
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted/50'
  },
  info: {
    icon: <IconInfoCircle className="size-12" />,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  warning: {
    icon: <IconAlertTriangle className="size-12" />,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  }
}

export default function SectionPlaceholder({
  type,
  title,
  description,
  actionLabel,
  onAction,
  icon
}: SectionPlaceholderProps) {
  const config = typeConfig[type]
  const displayIcon = icon || config.icon

  return (
    <Card className="border-border/50 shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className={`${config.bgColor} ${config.iconColor} p-4 rounded-full mb-6`}>
          {displayIcon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            variant={type === 'error' ? 'destructive' : 'default'}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
