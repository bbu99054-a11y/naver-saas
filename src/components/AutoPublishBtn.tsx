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

export function AutoPublishBtn({ title, content, className = '' }: { title: string, content: string, className?: string }) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [naverId, setNaverId] = useState("")
  const [showIdModal, setShowIdModal] = useState(false)
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

  const handlePublishClick = () => {
    const editorDom = document.getElementById('editor-preview')
    const finalContent = editorDom ? editorDom.innerHTML : content

    if (!finalContent) {
      toast({ title: "발행 불가", description: "먼저 AI 원고를 생성해주세요." })
      return
    }
    if (!isInstalled) {
      toast({ title: "확장 프로그램 미설치", description: "Chrome 확장 프로그램을 설치해주세요." })
      return
    }
    if (!naverId.trim()) {
      setShowIdModal(true)
      return
    }
    executePublish(naverId)
  }

  const handleSaveIdAndPublish = () => {
    if (!naverId.trim()) {
      toast({ title: "알림", description: "아이디를 입력해주세요" })
      return
    }
    localStorage.setItem("seo_naver_id", naverId.trim())
    setShowIdModal(false)
    executePublish(naverId.trim())
  }

  const executePublish = (idToUse: string) => {
    const editorDom = document.getElementById('editor-preview')
    const finalContent = editorDom ? editorDom.innerHTML : content

    toast({
      title: "🚀 발행 명령 전송 완료",
      description: "입력하신 네이버 블로그에 자동 발행을 시작합니다."
    })

    window.postMessage({
      type: "FROM_SAAS_PUBLISH",
      payload: { title, content: finalContent, naverId: idToUse }
    }, "*")
  }

  return (
    <>
      <Button 
        onClick={handlePublishClick}
        className={`font-bold shadow-md transition-all ${
          isInstalled 
            ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
            : "bg-slate-300 text-slate-500 hover:bg-slate-300 cursor-not-allowed"
        } ${className}`}
      >
        <Rocket className="w-5 h-5 mr-2" />
        <span className="hidden xl:inline">네이버 </span>자동 발행
        {!isInstalled && (
          <AlertCircle className="w-4 h-4 ml-2 text-rose-500" />
        )}
      </Button>

      {/* Naver ID Modal */}
      {showIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">네이버 아이디 연동</h3>
              <p className="text-sm text-slate-500 mb-6">
                발행하실 네이버 아이디를 입력해주세요.
              </p>
              
              <div className="space-y-4">
                <Input 
                  placeholder="본인의 네이버 아이디 입력" 
                  value={naverId}
                  onChange={(e) => setNaverId(e.target.value)}
                  className="h-12 border-slate-300 focus:ring-indigo-500"
                  autoFocus
                />
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 h-12 text-slate-600" onClick={() => setShowIdModal(false)}>
                    취소
                  </Button>
                  <Button className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold" onClick={handleSaveIdAndPublish}>
                    저장 및 발행
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
