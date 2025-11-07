'use client'

import React from 'react'
import { Github } from 'lucide-react'

export const AppFooter = React.memo(() => {
  return (
    <footer className="border-t bg-muted/30 backdrop-blur-sm">
      <div className="container-custom py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>Données du brevet des collèges 2025</span>
            <span>•</span>
            <span>
              Application développée par{" "}
              <a
                href="https://x.com/AureaLibe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Aurealibe
              </a>
              . Données fournies par{" "}
              <a
                href="https://x.com/dr_cartologue"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                dr_cartologue
              </a>
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <a
              href="https://github.com/Aurealibe/mentionbrevet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <Github className="h-4 w-4" />
              <span>Code source sur GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
})

AppFooter.displayName = 'AppFooter'