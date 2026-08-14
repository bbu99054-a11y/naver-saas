import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveApiKeys } from '@/actions/settings'
import { redirect } from 'next/navigation'
import { KeyRound, CheckCircle2, Globe, FileText } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { user_id: user.id }
  })

  // DB에 암호화되어 저장된 키가 존재하는지 여부만 확인
  const hasCoupangKeys = !!(apiKeyRecord?.coupang_access_key && apiKeyRecord?.coupang_secret_key)
  const hasWpKey = !!apiKeyRecord?.wp_api_key
  const hasTistoryKey = !!apiKeyRecord?.tistory_access_token

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">API 설정</h2>
        <p className="text-muted-foreground mt-2">
          외부 서비스(쿠팡, 워드프레스, 티스토리) 연동을 위한 API 키를 관리합니다. <br/>
          (보안을 위해 저장된 비밀번호 및 토큰은 암호화되어 보관되며, 화면에 다시 노출되지 않습니다.)
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
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium border border-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>쿠팡 파트너스 키가 안전하게 등록되어 있습니다.</span>
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
            <Globe className="w-5 h-5 text-blue-600" />
            워드프레스 (WordPress) 연동
          </CardTitle>
          <CardDescription>
            워드프레스 관리자 페이지에서 발급받은 'Application Passwords'를 입력해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasWpKey && (
            <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg flex items-center gap-2 text-sm font-medium border border-blue-100">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <span>워드프레스 연동 정보가 등록되어 있습니다.</span>
            </div>
          )}
          <form action={async (formData) => { 'use server'; await saveApiKeys(formData); }} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">워드프레스 사이트 주소 (URL)</label>
              <Input name="wpUrl" placeholder="예: https://myblog.com" defaultValue={apiKeyRecord?.wp_url || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">워드프레스 사용자명 (Username)</label>
              <Input name="wpUsername" placeholder="예: admin" defaultValue={apiKeyRecord?.wp_username || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Application Password</label>
              <Input name="wpApiKey" type="password" placeholder="4자리씩 띄어진 24자리 비밀번호 (예: xxxx xxxx xxxx xxxx)" />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {hasWpKey ? '워드프레스 연동 정보 업데이트' : '워드프레스 연동 저장하기'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            티스토리 (Tistory) 연동
          </CardTitle>
          <CardDescription>
            티스토리 OpenAPI 가이드에 따라 발급받은 Access Token을 입력해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasTistoryKey && (
            <div className="mb-6 p-4 bg-orange-50 text-orange-800 rounded-lg flex items-center gap-2 text-sm font-medium border border-orange-100">
              <CheckCircle2 className="w-5 h-5 text-orange-500" />
              <span>티스토리 토큰이 등록되어 있습니다.</span>
            </div>
          )}
          <form action={async (formData) => { 'use server'; await saveApiKeys(formData); }} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">티스토리 블로그 이름 (Blog Name)</label>
              <Input name="tistoryBlogName" placeholder="예: myblog (myblog.tistory.com 의 경우)" defaultValue={apiKeyRecord?.tistory_blog_name || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Access Token</label>
              <Input name="tistoryAccessToken" type="password" placeholder="티스토리 OpenAPI Access Token" />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              {hasTistoryKey ? '티스토리 연동 정보 업데이트' : '티스토리 연동 저장하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
    </div>
  )
}
