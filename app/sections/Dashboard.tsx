'use client'

import { FaSync, FaDownload } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import ContentCard, { type ContentItem } from './ContentCard'
import EmptyState from './EmptyState'

type FilterType = 'all' | 'post' | 'reel'

interface DashboardProps {
  items: ContentItem[]
  loading: boolean
  error: string
  summary: string
  totalCount: number
  postsCount: number
  reelsCount: number
  selectedIds: Set<string>
  filter: FilterType
  hasFetched: boolean
  onFetch: () => void
  onFilterChange: (f: FilterType) => void
  onToggleSelect: (id: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'post', label: 'Posts' },
  { value: 'reel', label: 'Reels' },
]

function SkeletonCard() {
  return (
    <div className="bg-card/75 backdrop-blur-[16px] border border-white/[0.18] rounded-lg shadow-md overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({
  items,
  loading,
  error,
  summary,
  totalCount,
  postsCount,
  reelsCount,
  selectedIds,
  filter,
  hasFetched,
  onFetch,
  onFilterChange,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
}: DashboardProps) {
  const filteredItems = Array.isArray(items)
    ? items.filter((item) => {
        if (filter === 'all') return true
        return (item?.type ?? '').toLowerCase() === filter
      })
    : []

  const selectedCount = selectedIds.size

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={onFetch} disabled={loading} size="default" className="gap-2">
            <FaSync className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            {loading ? 'Fetching...' : 'Fetch Saved Items'}
          </Button>

          {hasFetched && (
            <Badge variant="secondary" className="text-xs px-3 py-1">
              {totalCount} item{totalCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {hasFetched && (
          <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onFilterChange(opt.value)}
                className={cn(
                  'px-4 py-1.5 text-xs font-medium rounded-full transition-all',
                  filter === opt.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label}
                {opt.value === 'post' && postsCount > 0 && ` (${postsCount})`}
                {opt.value === 'reel' && reelsCount > 0 && ` (${reelsCount})`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {hasFetched && summary && (
        <p className="text-sm text-muted-foreground mb-6">{summary}</p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Content Grid */}
      {!loading && hasFetched && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ContentCard
              key={item?.id ?? Math.random().toString()}
              item={item}
              isSelected={selectedIds.has(item?.id ?? '')}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}

      {/* Empty States */}
      {!loading && !hasFetched && !error && (
        <EmptyState
          message="Click Fetch Saved Items to get started. Your saved Facebook posts and reels will appear here."
          showCta
          ctaLabel="Fetch Saved Items"
          onCtaClick={onFetch}
        />
      )}

      {!loading && hasFetched && filteredItems.length === 0 && !error && (
        <EmptyState
          message={
            filter !== 'all'
              ? `No saved ${filter}s found. Try switching the filter.`
              : 'No saved items found on your account.'
          }
        />
      )}

      {/* Bulk Action Toolbar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-foreground">{selectedCount} selected</span>
              <button
                onClick={onSelectAll}
                className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
              >
                Select All
              </button>
              <button
                onClick={onDeselectAll}
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
              >
                Deselect All
              </button>
            </div>
            <Button size="sm" className="gap-2">
              <FaDownload className="w-3 h-3" />
              Download Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
