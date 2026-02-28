'use client'

import { FaFacebook } from 'react-icons/fa'
import { cn } from '@/lib/utils'

interface HeaderProps {
  activeTab: 'dashboard' | 'settings'
  onTabChange: (tab: 'dashboard' | 'settings') => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="w-full bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <FaFacebook className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">FB Saved Downloader</h1>
          </div>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors relative',
                activeTab === 'dashboard'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Dashboard
              {activeTab === 'dashboard' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => onTabChange('settings')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors relative',
                activeTab === 'settings'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Settings
              {activeTab === 'settings' && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
