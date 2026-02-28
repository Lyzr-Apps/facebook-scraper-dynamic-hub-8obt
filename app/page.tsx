'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Header from './sections/Header'
import Dashboard from './sections/Dashboard'
import Settings from './sections/Settings'
import { type ContentItem } from './sections/ContentCard'

// ── Constants ──────────────────────────────────────────────
const AGENT_ID = '69a274eb71a7effa8577bff4'
const AGENT_NAME = 'Saved Content Agent'

// ── Sample Data ────────────────────────────────────────────
const SAMPLE_ITEMS: ContentItem[] = [
  {
    id: '101',
    type: 'Post',
    title: 'Amazing sunset photo from my trip to Bali -- the golden hour was absolutely stunning',
    thumbnail: '',
    sourceUrl: 'https://www.facebook.com/photo/?fbid=101',
    dateSaved: '2026-02-28T10:30:00Z',
    author: 'John Doe',
  },
  {
    id: '102',
    type: 'Reel',
    title: 'How to make the perfect espresso at home in under 3 minutes',
    thumbnail: '',
    sourceUrl: 'https://www.facebook.com/reel/102',
    dateSaved: '2026-02-27T15:45:00Z',
    author: 'Coffee Masters',
  },
  {
    id: '103',
    type: 'Post',
    title: '10 hidden features in the latest iOS update you probably missed',
    thumbnail: '',
    sourceUrl: 'https://www.facebook.com/photo/?fbid=103',
    dateSaved: '2026-02-26T09:15:00Z',
    author: 'TechDaily',
  },
  {
    id: '104',
    type: 'Reel',
    title: 'Quick 15-minute full body workout -- no equipment needed',
    thumbnail: '',
    sourceUrl: 'https://www.facebook.com/reel/104',
    dateSaved: '2026-02-25T18:00:00Z',
    author: 'FitLife',
  },
  {
    id: '105',
    type: 'Post',
    title: 'The best bookstores in Paris that every book lover should visit',
    thumbnail: '',
    sourceUrl: 'https://www.facebook.com/photo/?fbid=105',
    dateSaved: '2026-02-24T12:00:00Z',
    author: 'Travel Reads',
  },
]

const SAMPLE_SUMMARY = 'Found 5 saved items: 3 posts and 2 reels'

// ── Types ──────────────────────────────────────────────────
type FilterType = 'all' | 'post' | 'reel'

// ── ErrorBoundary ──────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Page ───────────────────────────────────────────────────
export default function Page() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard')

  // Sample data toggle
  const [useSample, setUseSample] = useState(false)

  // Agent state
  const [items, setItems] = useState<ContentItem[]>([])
  const [summary, setSummary] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [postsCount, setPostsCount] = useState(0)
  const [reelsCount, setReelsCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasFetched, setHasFetched] = useState(false)

  // Facebook email state
  const [facebookEmail, setFacebookEmail] = useState('')

  // Load saved email from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fb_saved_email')
      if (saved) setFacebookEmail(saved)
    } catch {}
  }, [])

  // UI state
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  // ── Derived sample state ──
  const displayItems = useSample ? SAMPLE_ITEMS : items
  const displaySummary = useSample ? SAMPLE_SUMMARY : summary
  const displayTotal = useSample ? 5 : totalCount
  const displayPosts = useSample ? 3 : postsCount
  const displayReels = useSample ? 2 : reelsCount
  const displayHasFetched = useSample ? true : hasFetched

  // ── Handlers ──
  const handleFetch = useCallback(async () => {
    if (!facebookEmail.trim()) {
      setError('Please go to Settings and enter your Facebook email first.')
      return
    }

    setLoading(true)
    setError('')
    setActiveAgentId(AGENT_ID)
    setSelectedIds(new Set())

    try {
      const message = `Fetch saved Facebook posts and reels for the account: ${facebookEmail.trim()}`
      const result = await callAIAgent(message, AGENT_ID)

      if (result.success) {
        let data = result?.response?.result
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch {
            // use as-is
          }
        }

        const fetchedItems = Array.isArray(data?.items) ? data.items : []
        setItems(fetchedItems)
        setSummary(data?.summary ?? '')
        setTotalCount(data?.total_count ?? fetchedItems.length)
        setPostsCount(data?.posts_count ?? 0)
        setReelsCount(data?.reels_count ?? 0)
        setHasFetched(true)
      } else {
        setError(result?.error ?? 'Failed to fetch saved items. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }, [facebookEmail])

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    const allIds = (Array.isArray(displayItems) ? displayItems : []).map((i) => i?.id ?? '')
    setSelectedIds(new Set(allIds))
  }, [displayItems])

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen bg-background text-foreground font-sans"
        style={{
          background: 'linear-gradient(135deg, hsl(210 20% 97%) 0%, hsl(220 25% 95%) 35%, hsl(200 20% 96%) 70%, hsl(230 15% 97%) 100%)',
        }}
      >
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Sample Data Toggle */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-end items-center gap-2">
          <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">
            Sample Data
          </Label>
          <Switch
            id="sample-toggle"
            checked={useSample}
            onCheckedChange={setUseSample}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <Dashboard
            items={displayItems}
            loading={loading}
            error={error}
            summary={displaySummary}
            totalCount={displayTotal}
            postsCount={displayPosts}
            reelsCount={displayReels}
            selectedIds={selectedIds}
            filter={filter}
            hasFetched={displayHasFetched}
            hasEmail={!!facebookEmail.trim()}
            onFetch={handleFetch}
            onFilterChange={setFilter}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            agentId={AGENT_ID}
            facebookEmail={facebookEmail}
            onEmailChange={setFacebookEmail}
          />
        )}

        {/* Agent Status */}
        <div className="fixed bottom-4 left-4 z-30">
          <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg p-3 shadow-lg max-w-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${activeAgentId ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/40'}`}
              />
              <span className="text-xs font-medium text-card-foreground truncate">{AGENT_NAME}</span>
              {activeAgentId && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono truncate">{AGENT_ID}</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
