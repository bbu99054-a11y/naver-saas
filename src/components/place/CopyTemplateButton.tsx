'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyTemplateButtonProps {
  text: string
  label?: string
}

export default function CopyTemplateButton({ text, label = '예시 문구 복사' }: CopyTemplateButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        const el = document.createElement('textarea')
        el.value = text
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // ignore clipboard failure
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
          <span className="text-emerald-700">복사 완료</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
