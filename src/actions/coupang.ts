'use server'

import prisma from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export interface CoupangProduct {
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket: boolean;
}

export interface CoupangActionResponse {
  success: boolean;
  data?: CoupangProduct[];
  error?: string;
}

function generateHmac(method: string, path: string, secretKey: string, accessKey: string) {
  const now = new Date();
  
  // YYMMDD'T'HHMMSS'Z' 포맷 생성
  const year = String(now.getUTCFullYear()).slice(-2);
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const date = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  const datetime = `${year}${month}${date}T${hours}${minutes}${seconds}Z`;

  const message = `${datetime}${method}${path}`;
  
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

export async function searchCoupangProducts(keyword: string): Promise<CoupangActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: '인증되지 않은 사용자입니다. 로그인이 필요합니다.' };
    }

    // DB에서 암호화된 API 키 조회
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { user_id: user.id }
    });

    if (!apiKeyRecord || !apiKeyRecord.coupang_access_key || !apiKeyRecord.coupang_secret_key) {
      return { success: false, error: '쿠팡 파트너스 API 키가 설정되지 않았습니다. API 설정 메뉴에서 키를 등록해 주세요.' };
    }

    // API 키 복호화
    let accessKey: string;
    let secretKey: string;
    try {
      accessKey = decrypt(apiKeyRecord.coupang_access_key);
      secretKey = decrypt(apiKeyRecord.coupang_secret_key);
    } catch (e) {
      return { success: false, error: 'API 키 복호화에 실패했습니다. 키를 다시 저장해 주세요.' };
    }

    const method = 'GET';
    const path = '/v2/providers/affiliate_open_api/apis/openapi/products/search';
    
    // 키워드는 URL 인코딩 필요
    const encodedKeyword = encodeURIComponent(keyword);
    const query = `?keyword=${encodedKeyword}&limit=10`;
    
    // HMAC 서명 생성
    const authorization = generateHmac(method, path, secretKey, accessKey);

    const url = `https://api-gateway.coupang.com${path}${query}`;

    // 외부 API 호출
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
         return { success: false, error: '쿠팡 API 호출 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.' };
      }
      if (response.status === 401 || response.status === 403) {
         return { success: false, error: '유효하지 않은 쿠팡 API 키입니다. 설정에서 키가 정확한지 확인해 주세요.' };
      }
      return { success: false, error: `쿠팡 API 호출 에러: ${response.status} ${response.statusText}` };
    }

    const data = await response.json();

    if (data.rCode !== '0') {
       return { success: false, error: data.rMessage || '쿠팡 파트너스 API 호출에 실패했습니다.' };
    }

    // 필요한 필드만 추출하여 매핑
    const products: CoupangProduct[] = data.data.productData.map((item: any) => ({
      productName: item.productName,
      productPrice: item.productPrice,
      productImage: item.productImage,
      productUrl: item.productUrl,
      isRocket: item.isRocket || false
    }));

    return { success: true, data: products };

  } catch (error: any) {
    console.error('Coupang API Error:', error);
    return { success: false, error: '서버 내부 오류가 발생했습니다. 로그를 확인해 주세요.' };
  }
}
