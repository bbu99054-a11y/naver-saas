import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Rocket, AlertCircle, Settings } from 'lucide-react'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
      alert(`${props.title}\n${props.description}`);
    }
  }
}

export function AutoPublishBtn({ title, content }: { title: string, content: string }) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [naverId, setNaverId] = useState("")
  const [isEditingId, setIsEditingId] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check local storage for saved Naver ID
    const savedId = localStorage.getItem("seo_naver_id")
    if (savedId) {
      setNaverId(savedId)
    }

    // Check if extension injected the marker
    const checkMarker = () => {
      if (document.getElementById("seo-affiliate-extension-installed")) {
        setIsInstalled(true)
      }
    }
    
    checkMarker();
    const interval = setInterval(checkMarker, 1000);
    return () => clearInterval(interval);
  }, [])

  const handleSaveId = () => {
    if (!naverId.trim()) return;
    localStorage.setItem("seo_naver_id", naverId.trim())
    setIsEditingId(false)
    toast({
      title: "저장 완료",
      description: "네이버 아이디가 로컬에 저장되었습니다."
    })
  }

  const handlePublish = () => {
    if (!content) {
      toast({ title: "발행 불가", description: "먼저 AI 원고를 생성해주세요." })
      return
    }
    if (!isInstalled) {
      toast({ title: "확장 프로그램 미설치", description: "Chrome 확장 프로그램을 설치해주세요." })
      return
    }
    if (!naverId.trim()) {
      setIsEditingId(true)
      toast({ title: "아이디 입력 필요", description: "발행할 네이버 아이디를 먼저 입력해주세요." })
      return
    }

    toast({
      title: "🚀 발행 명령 전송 완료",
      description: "새 탭에서 네이버 블로그가 열리며 자동 발행이 시작됩니다."
    })

    window.postMessage({
      type: "FROM_SAAS_PUBLISH",
      payload: { title, content, naverId: naverId.trim() }
    }, "*")
  }

  return (
    <div className="flex flex-col w-full gap-2">
      {!naverId || isEditingId ? (
        <div className="flex items-center gap-2 mb-2 p-3 bg-slate-50 border border-slate-200 rounded-md">
          <Input 
            placeholder="본인의 네이버 아이디 입력" 
            value={naverId}
            onChange={(e) => setNaverId(e.target.value)}
            className="h-9"
          />
          <Button onClick={handleSaveId} size="sm" className="whitespace-nowrap">저장</Button>
        </div>
      ) : (
        <div className="text-xs text-slate-500 text-right w-full flex justify-end items-center mb-1 gap-1">
          연동된 계정: <span className="font-bold text-indigo-600">{naverId}</span>
          <button onClick={() => setIsEditingId(true)} className="text-slate-400 hover:text-slate-700 ml-1">
            <Settings className="w-3 h-3" />
          </button>
        </div>
      )}

      <Button 
        onClick={handlePublish}
        className={`w-full font-bold shadow-lg h-12 text-md transition-all ${
          isInstalled 
            ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
            : "bg-slate-300 text-slate-500 hover:bg-slate-300 cursor-not-allowed"
        }`}
      >
        <Rocket className="w-5 h-5 mr-2" />
        네이버 블로그 즉시 발행 (RPA)
        {!isInstalled && (
          <AlertCircle className="w-4 h-4 ml-2 text-rose-500" />
        )}
      </Button>
    </div>
  )
}
