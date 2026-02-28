'use client'

import { FaPlay, FaImage, FaUser, FaExternalLinkAlt } from 'react-icons/fa'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ContentItem {
  id: string
  type: string
  title: string
  thumbnail: string
  sourceUrl: string
  dateSaved: string
  author: string
}

interface ContentCardProps {
  item: ContentItem
  isSelected: boolean
  onToggleSelect: (id: string) => void
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function isReel(type: string): boolean {
  return (type ?? '').toLowerCase() === 'reel'
}

export default function ContentCard({ item, isSelected, onToggleSelect }: ContentCardProps) {
  const itemType = item?.type ?? 'Post'
  const reel = isReel(itemType)

  return (
    <div className={cn(
      'group relative bg-card/75 backdrop-blur-[16px] border border-white/[0.18] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
      isSelected && 'ring-2 ring-primary'
    )}>
      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {item?.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item?.title ?? 'Content thumbnail'}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const fallback = target.nextElementSibling as HTMLElement | null
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            item?.thumbnail ? 'hidden' : 'flex'
          )}
          style={item?.thumbnail ? { display: 'none' } : undefined}
        >
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            reel ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
          )}>
            {reel ? <FaPlay className="w-6 h-6 text-white ml-1" /> : <FaImage className="w-6 h-6 text-white" />}
          </div>
        </div>

        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(item?.id ?? '')}
            className="bg-white/90 border-white/50 shadow-sm"
          />
        </div>

        <div className="absolute top-2 right-2 z-10">
          <Badge className={cn(
            'text-[10px] font-semibold shadow-sm',
            reel
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0'
          )}>
            {itemType}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-card-foreground line-clamp-2 leading-snug">
          {item?.title ?? 'Untitled'}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0">
            <FaUser className="w-3 h-3 shrink-0" />
            <span className="truncate">{item?.author ?? 'Unknown'}</span>
          </div>
          <span className="shrink-0 ml-2">{formatDate(item?.dateSaved ?? '')}</span>
        </div>

        {item?.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <FaExternalLinkAlt className="w-3 h-3" />
            View Original
          </a>
        )}
      </div>
    </div>
  )
}
