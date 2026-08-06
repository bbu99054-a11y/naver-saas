'use client'

import { Button } from '@/components/ui/button'
import { PenTool } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CurationLinkBtn({ keyword }: { keyword: string }) {
  const router = useRouter()
  return (
    <Button 
      onClick={() => router.push(`/dashboard/write?keyword=${encodeURIComponent(keyword)}`)}
      className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-colors"
    >
      <PenTool className="w-4 h-4 mr-2" />
      글쓰기 시작
    </Button>
  )
}
