'use client'
import { useEffect } from 'react'

declare global {
  interface Window {
    $crisp: unknown[]
    CRISP_WEBSITE_ID: string
  }
}

export function CrispChat() {
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
  useEffect(() => {
    if (!websiteId) return
    window.$crisp = []
    window.$crisp.push(['config', 'color:theme', ['#2F5C8F']])
    window.CRISP_WEBSITE_ID = websiteId
    const s = document.createElement('script')
    s.src = 'https://client.crisp.chat/l.js'
    s.async = true
    document.head.appendChild(s)
  }, [websiteId])
  return null
}
