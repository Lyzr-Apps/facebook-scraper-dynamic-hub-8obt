'use client'

import { FaBookmark } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  message: string
  showCta?: boolean
  ctaLabel?: string
  onCtaClick?: () => void
}

export default function EmptyState({ message, showCta, ctaLabel, onCtaClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <FaBookmark className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-center text-base max-w-md mb-6">{message}</p>
      {showCta && ctaLabel && onCtaClick && (
        <Button onClick={onCtaClick} size="lg">
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
