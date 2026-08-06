import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveApiKeys } from '@/actions/settings'
import { redirect } from 'next/navigation'
import { KeyRound, CheckCircle2 } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { user_id: user.id }
  })

  // DB에 암호화되어 저장된 키가 존재하는지 여부만 확인 (절대 평문 노출 금지)
  const hasCoupangKeys = !!(apiKeyRecord?.coupang_access_key && apiKeyRecord?.coupang_secret_key)
  const hasWpKey = !!apiKeyRecord?.wp_api_key

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">API 설정</h2>
        <p className="text-muted-foreground mt-2">
          외부 서비스(쿠팡 파트너스, 워드프레스) 연동을 위한 API 키를 관리합니다. <br/>
          (보안을 위해 저장된 키는 암호화되어 보관되며, 화면에 다시 노출되지 않습니다.)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-500" />
            쿠팡 파트너스 API
          </CardTitle>
          <CardDescription>
            쿠팡 파트너스 오픈 API 발급처에서 Access Key와 Secret Key를 발급받아 입력해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasCoupangKeys && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>쿠팡 파트너스 키가 이미 안전하게 등록되어 있습니다. 변경하려면 아래에 새로 입력하세요.</span>
            </div>
          )}
          <form action={async (formData) => { 'use server'; await saveApiKeys(formData); }} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Access Key</label>
              <Input name="coupangAccessKey" placeholder="쿠팡 Access Key 입력" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Secret Key</label>
              <Input name="coupangSecretKey" type="password" placeholder="쿠팡 Secret Key 입력" />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              {hasCoupangKeys ? '쿠팡 키 업데이트' : '쿠팡 키 저장하기'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-slate-600" />
            워드프레스 (WordPress) API
          </CardTitle>
          <CardDescription>
            향후 자동 포스팅 기능에 사용될 워드프레스 애플리케이션 비밀번호를 입력해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasWpKey && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>워드프레스 키가 이미 안전하게 등록되어 있습니다.</span>
            </div>
          )}
          <form action={async (formData) => { 'use server'; await saveApiKeys(formData); }} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">WP Application Password</label>
              <Input name="wpApiKey" type="password" placeholder="워드프레스 앱 비밀번호 입력" />
            </div>
            <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white">
              {hasWpKey ? '워드프레스 키 업데이트' : '워드프레스 키 저장하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
