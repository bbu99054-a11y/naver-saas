'use client'

import { useEffect, useRef, useState } from 'react'
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk'
import { useSearchParams, useRouter, Suspense } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'

// 토스페이먼츠 테스트용 클라이언트 키 (공용)
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null)
  const [loading, setLoading] = useState(true)
  
  const plan = searchParams.get('plan') || 'basic'
  const amount = Number(searchParams.get('amount')) || 49000
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  
  useEffect(() => {
    const initWidget = async () => {
      try {
        const customerKey = 'customer_' + Math.random().toString(36).substring(2, 10)
        const widget = await loadPaymentWidget(clientKey, customerKey)
        setPaymentWidget(widget)
        
        widget.renderPaymentMethods('#payment-method', { value: amount })
        widget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })
        setLoading(false)
      } catch (error) {
        console.error('Failed to load payment widget', error)
      }
    }
    
    initWidget()
  }, [amount])

  const handlePayment = async () => {
    if (!paymentWidget) return
    
    try {
      await paymentWidget.requestPayment({
        orderId: orderId,
        orderName: `PostSync ${plan.toUpperCase()} 요금제`,
        successUrl: `${window.location.origin}/dashboard/billing/success?plan=${plan}`,
        failUrl: `${window.location.origin}/dashboard/billing/fail`,
        customerEmail: 'customer@example.com',
        customerName: 'PostSync 고객',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> 뒤로 가기
      </Button>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">결제하기</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h3 className="text-lg font-bold mb-2">결제 상품: {plan.toUpperCase()} 요금제</h3>
        <p className="text-slate-600 mb-4">결제 금액: <strong className="text-indigo-600">{amount.toLocaleString()}원</strong></p>
        
        {loading && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="ml-3 text-slate-500">안전한 결제창을 불러오는 중...</span>
          </div>
        )}
        
        {/* 결제 UI 렌더링 영역 */}
        <div id="payment-method" className="w-full" />
        <div id="agreement" className="w-full mb-6" />
        
        {!loading && (
          <Button 
            onClick={handlePayment} 
            className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
          >
            {amount.toLocaleString()}원 안전하게 결제하기
          </Button>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
