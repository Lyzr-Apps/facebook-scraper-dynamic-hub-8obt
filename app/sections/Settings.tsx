'use client'

import { useState, useEffect } from 'react'
import { FaFacebook, FaCheckCircle, FaInfoCircle, FaEnvelope, FaTimesCircle, FaSave } from 'react-icons/fa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface SettingsProps {
  agentId: string
  facebookEmail: string
  onEmailChange: (email: string) => void
}

export default function Settings({ agentId, facebookEmail, onEmailChange }: SettingsProps) {
  const [emailInput, setEmailInput] = useState(facebookEmail)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setEmailInput(facebookEmail)
  }, [facebookEmail])

  const isConnected = facebookEmail.trim().length > 0

  const handleSave = () => {
    const trimmed = emailInput.trim()
    onEmailChange(trimmed)
    if (trimmed) {
      try { localStorage.setItem('fb_saved_email', trimmed) } catch {}
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDisconnect = () => {
    setEmailInput('')
    onEmailChange('')
    try { localStorage.removeItem('fb_saved_email') } catch {}
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
      {/* Facebook Account Card */}
      <Card className="bg-card/75 backdrop-blur-[16px] border border-white/[0.18] shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FaFacebook className="w-5 h-5 text-blue-500" />
            Facebook Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Status Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FaFacebook className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {isConnected ? emailInput : 'No account linked'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isConnected ? 'Account email saved for agent queries' : 'Enter your Facebook email to get started'}
                </p>
              </div>
            </div>
            {isConnected ? (
              <Badge className="bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20">
                <FaCheckCircle className="w-3 h-3 mr-1" />
                Linked
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-muted-foreground">
                <FaTimesCircle className="w-3 h-3 mr-1" />
                Not Linked
              </Badge>
            )}
          </div>

          <Separator />

          {/* Email Input */}
          <div className="space-y-3">
            <Label htmlFor="fb-email" className="text-sm font-medium">
              Facebook Email Address
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="fb-email"
                  type="email"
                  placeholder="your.email@facebook.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSave} disabled={!emailInput.trim()} size="default" className="gap-2">
                <FaSave className="w-3.5 h-3.5" />
                Save
              </Button>
            </div>

            {/* Inline Feedback */}
            {saved && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3" />
                Email saved successfully. The agent will use this for your Facebook queries.
              </p>
            )}
          </div>

          {/* Disconnect */}
          {isConnected && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Remove your linked Facebook email
                </p>
                <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-destructive hover:text-destructive gap-1.5 text-xs">
                  <FaTimesCircle className="w-3 h-3" />
                  Disconnect
                </Button>
              </div>
            </>
          )}

          <Separator />

          {/* Info */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <FaInfoCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>
              The agent handles Facebook authentication via OAuth when it connects to the Graph API.
              Your email is used to identify which account to query. The actual authorization
              happens through Facebook's secure OAuth flow managed by the agent at runtime.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* App Information Card */}
      <Card className="bg-card/75 backdrop-blur-[16px] border border-white/[0.18] shadow-md">
        <CardHeader>
          <CardTitle className="text-base">App Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Application</span>
              <span className="text-card-foreground font-medium">FB Saved Downloader</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="text-card-foreground font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Agent ID</span>
              <span className="text-card-foreground font-mono text-xs">{agentId}</span>
            </div>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground leading-relaxed">
            FB Saved Downloader lets you fetch and browse your saved Facebook posts and reels. Filter by content type, view thumbnails, and access original links -- all powered by the Saved Content Agent via the Facebook Graph API.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
