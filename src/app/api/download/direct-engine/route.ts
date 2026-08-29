import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import JSZip from 'jszip'

export async function GET() {
  try {
    const helperDir = path.join(process.cwd(), 'local-helper')
    const zip = new JSZip()

    const filesToInclude = [
      'server.js',
      'naverEngine.js',
      'start-engine-silent.vbs',
      'register-startup.bat',
      'unregister-startup.bat',
      'stop-engine.bat',
      'start-helper.bat',
      'package.json'
    ]

    for (const filename of filesToInclude) {
      const filePath = path.join(helperDir, filename)
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath)
        zip.file(filename, fileContent)
      }
    }

    // 고객을 위한 친절한 한글 설명서 포함
    const readmeContent = `================================================================
  PostSynk AI 다이렉트 엔진 (공식 보안 커넥터) 1초 간편 가이드
================================================================

1. 다운로드 받은 압축(ZIP)을 원하는 폴더에 해제합니다.
2. [register-startup.bat] 파일을 1회 더블클릭합니다.
   -> 화면에 검은 창 없이 백그라운드에 조용히 안착되어 
      컴퓨터가 켜질 때마다 무음으로 자동 대기합니다.
3. PostSynk 웹 대시보드에서 [🚀 네이버 원클릭 자동 발행]을 누르시면 끝!

* 엔진을 종료하고 싶을 때는 언제든 [stop-engine.bat]을 실행하세요.
* 비밀번호는 저장되지 않으며, 고객 PC 내 100% 로컬 보안 세션으로 안전하게 동작합니다.
================================================================`

    zip.file('README_간편가이드.txt', readmeContent)

    const zipBuffer = await zip.generateAsync({
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    })

    return new Response(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="PostSynk-Direct-Engine.zip"',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('[Download Direct Engine Error]', error)
    return NextResponse.json(
      { success: false, error: '엔진 다운로드 파일 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
