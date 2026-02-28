'use client'

import { FaFacebook, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface SettingsProps {
  agentId: string
}

export default function Settings({ agentId }: SettingsProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
      <Card className="bg-card/75 backdrop-blur-[16px] border border-white/[0.18] shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FaFacebook className="w-5 h-5 text-blue-500" />
            Facebook Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FaFacebook className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">Facebook User</p>
                <p className="text-xs text-muted-foreground">OAuth connected via agent</p>
              </div>
            </div>
            <Badge className="bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/20">
              <FaCheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </div>
          <Separator />
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <FaInfoCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>Your Facebook account is connected through the agent integration. The agent securely accesses your saved posts and reels via the Facebook Graph API.</p>
          </div>
        </CardContent>
      </Card>

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
