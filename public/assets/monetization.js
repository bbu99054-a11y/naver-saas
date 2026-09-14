/**
 * PostSync Web Tools Monetization Common Client Script (2026)
 * Handles: Lead Magnet submission, Ebook TOC preview modal, Bank Transfer order modal
 */

(function () {
  // Common Bank Info (Synced with PostSync billing system)
  const BANK_INFO = {
    bankName: '국민은행',
    accountNumber: '93043922640',
    holder: '유영무',
    amount: 39000,
    formattedAmount: '39,000원',
    bookTitle: '2026 전문직·사업자 네이버 상위 1% 실전 공략집 (PDF)',
  };

  // 1. Modal DOM Injection (Creates modals dynamically if not already present)
  function ensureModals() {
    if (document.getElementById('mzModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'mzModalOverlay';
    overlay.className = 'mz-modal-overlay';
    overlay.onclick = function (e) {
      if (e.target === overlay) closeMonetizationModal();
    };

    overlay.innerHTML = `
      <!-- 1. TOC Preview Modal -->
      <div class="mz-modal-dialog" id="mzTocDialog" style="display:none;">
        <div class="mz-modal-header">
          <h3 class="mz-modal-title">📖 『2026 네이버 상위 1% 공략집』 핵심 목차</h3>
          <button type="button" class="mz-modal-close" onclick="closeMonetizationModal()">&times;</button>
        </div>
        <div class="mz-modal-body">
          <div style="font-size:12.5px; color:#475569; margin-bottom:16px; line-height:1.5;">
            현직 전문직 및 마케팅 대행사들이 숨기는 <b>2026 C-Rank 알고리즘과 합법적 광고 규정</b>을 집대성한 실전 PDF 가이드북입니다.
          </div>
          
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 1. 2026 네이버 검색엔진 지각변동과 C-Rank의 비밀</div>
            <div class="mz-toc-desc">스마트블록, 인공지능 인용(AEO) 로직 및 일반 글이 저품질로 빠지는 3대 이유 분석</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 2. 전문직 4대 직역별(변호사/의사/세무사/노무사) 광고법 완전 정복</div>
            <div class="mz-toc-desc">변호사법 제23조, 의료법 제56조 금칙어 500제와 실제 협회 징계/과태료 방어 사례</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 3. 체류시간 3분을 보장하는 1인칭 실무 경험 스토리텔링</div>
            <div class="mz-toc-desc">ChatGPT 글쓰기 티를 완전히 지우고 의뢰인의 신뢰를 1초 만에 얻는 칼럼 구조</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 4. 1080x1080 인포그래픽 카드뉴스 9종 제작 공식</div>
            <div class="mz-toc-desc">크몽에서 장당 2만 원 받는 고화질 비교표, 체크리스트, 절차도 기획 템플릿</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 5. 읽고 나서 상담 문의로 직결되는 인바운드 위젯 세팅</div>
            <div class="mz-toc-desc">블로그 글 끝에서 이탈하지 않고 카카오톡/전화 예약으로 전환시키는 CTA 공식</div>
          </div>

          <div style="margin-top:20px;">
            <button type="button" class="btn-ebook-order" onclick="openEbookOrderModal()">
              <i class="fa-solid fa-credit-card"></i> <span>39,000원에 실전 공략집 평생 소장하기</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Bank Transfer Order Modal -->
      <div class="mz-modal-dialog" id="mzOrderDialog" style="display:none;">
        <div class="mz-modal-header">
          <h3 class="mz-modal-title">💳 전자책 무통장 입금 신청</h3>
          <button type="button" class="mz-modal-close" onclick="closeMonetizationModal()">&times;</button>
        </div>
        <div class="mz-modal-body">
          <div class="mz-bank-box">
            <div class="mz-bank-row">
              <span class="mz-bank-label">입금 은행</span>
              <span class="mz-bank-val">${BANK_INFO.bankName}</span>
            </div>
            <div class="mz-bank-row">
              <span class="mz-bank-label">계좌 번호</span>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="mz-bank-val">${BANK_INFO.accountNumber}</span>
                <button type="button" class="mz-btn-copy" id="mzBtnCopyAccount" onclick="copyBankAccount()">
                  <i class="fa-regular fa-copy"></i> 복사
                </button>
              </div>
            </div>
            <div class="mz-bank-row">
              <span class="mz-bank-label">예금주</span>
              <span class="mz-bank-val">${BANK_INFO.holder}</span>
            </div>
            <div class="mz-bank-row" style="border-top:1px dashed #cbd5e1; padding-top:8px; margin-top:8px;">
              <span class="mz-bank-label" style="font-weight:700; color:#0f172a;">결제 금액</span>
              <span class="mz-bank-val" style="color:#2563eb; font-size:16px;">${BANK_INFO.formattedAmount}</span>
            </div>
          </div>

          <form id="mzOrderForm" onsubmit="handleEbookOrderSubmit(event)">
            <div class="mz-form-group">
              <label for="mzOrderName"><i class="fa-solid fa-user"></i> 입금자명 (필수)</label>
              <input type="text" id="mzOrderName" class="mz-form-input" placeholder="예: 홍길동 (입금자명과 일치해야 확인이 빠릅니다)" required>
            </div>
            <div class="mz-form-group">
              <label for="mzOrderEmail"><i class="fa-solid fa-envelope"></i> 전자책(PDF) 수신 이메일 (필수)</label>
              <input type="email" id="mzOrderEmail" class="mz-form-input" placeholder="name@example.com" required>
            </div>
            <div class="mz-form-group">
              <label for="mzOrderPhone"><i class="fa-solid fa-phone"></i> 연락처 (선택 - 입금 확인 알림용)</label>
              <input type="tel" id="mzOrderPhone" class="mz-form-input" placeholder="010-0000-0000">
            </div>

            <button type="submit" class="btn-ebook-order" id="mzBtnSubmitOrder" style="padding:13px; font-size:14px; margin-top:16px;">
              <i class="fa-solid fa-check-circle"></i> <span>입금 신청 완료 및 주문 접수</span>
            </button>

            <div class="mz-order-notice">
              💡 <b>안내:</b> 입금 신청 접수 후 위 계좌로 입금해 주시면, 담당자가 실시간 입금 확인 후 기재하신 이메일로 암호화된 PDF 원본을 즉시 발송해 드립니다.
            </div>
          </form>

          <div id="mzOrderSuccessBox" style="display:none; text-align:center; padding:20px 10px;">
            <div style="font-size:36px; margin-bottom:12px;">🎉</div>
            <h4 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:6px;">입금 신청이 접수되었습니다!</h4>
            <p style="font-size:13px; color:#475569; line-height:1.6; margin-bottom:16px;">
              위 <b>${BANK_INFO.bankName} ${BANK_INFO.accountNumber}</b> 계좌로 <b>${BANK_INFO.formattedAmount}</b>을 입금해 주시면 확인 즉시 기재하신 이메일로 전송됩니다.
            </p>
            <button type="button" class="btn-ebook-preview" onclick="closeMonetizationModal()">확인 완료</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Escape key listener
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMonetizationModal();
    });
  }

  // 2. Open Ebook Preview Modal
  window.openEbookPreviewModal = function () {
    ensureModals();
    document.getElementById('mzModalOverlay').classList.add('open');
    document.getElementById('mzTocDialog').style.display = 'block';
    document.getElementById('mzOrderDialog').style.display = 'none';
  };

  // 3. Open Ebook Order Modal
  window.openEbookOrderModal = function () {
    ensureModals();
    document.getElementById('mzModalOverlay').classList.add('open');
    document.getElementById('mzTocDialog').style.display = 'none';
    document.getElementById('mzOrderDialog').style.display = 'block';
    document.getElementById('mzOrderForm').style.display = 'block';
    document.getElementById('mzOrderSuccessBox').style.display = 'none';
  };

  // 4. Close Modal
  window.closeMonetizationModal = function () {
    const overlay = document.getElementById('mzModalOverlay');
    if (overlay) {
      overlay.classList.remove('open');
    }
  };

  // 5. Copy Bank Account Number
  window.copyBankAccount = function () {
    const textToCopy = `${BANK_INFO.bankName} ${BANK_INFO.accountNumber}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      const btn = document.getElementById('mzBtnCopyAccount');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-check" style="color:#059669;"></i> 복사됨';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> 복사';
        }, 2000);
      }
    });
  };

  // 6. Handle Ebook Order Submit
  window.handleEbookOrderSubmit = async function (e) {
    e.preventDefault();
    const name = document.getElementById('mzOrderName').value.trim();
    const email = document.getElementById('mzOrderEmail').value.trim();
    const phone = document.getElementById('mzOrderPhone').value.trim();
    const btn = document.getElementById('mzBtnSubmitOrder');

    if (!name || !email) {
      alert('입금자명과 이메일 주소를 입력해 주세요.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 접수 중...';

    try {
      const currentTool = window.location.pathname.replace(/^\/|\/$/g, '') || 'tools';
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSource: currentTool,
          leadType: 'ebook_order',
          name: name,
          email: email,
          phone: phone,
          metadata: {
            bookTitle: BANK_INFO.bookTitle,
            amount: BANK_INFO.amount,
            bank: `${BANK_INFO.bankName} ${BANK_INFO.accountNumber} (${BANK_INFO.holder})`,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        document.getElementById('mzOrderForm').style.display = 'none';
        document.getElementById('mzOrderSuccessBox').style.display = 'block';
      } else {
        alert(data.error || '접수 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> <span>입금 신청 완료 및 주문 접수</span>';
    }
  };

  // 7. Handle Inline Lead Magnet Submit
  window.handleLeadMagnetSubmit = async function (e, toolSource, docTitle) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successBox = form.parentElement.querySelector('.lead-magnet-success');

    if (!emailInput || !emailInput.value.trim()) {
      alert('가이드북을 받아보실 이메일을 입력해 주세요.');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSource: toolSource || 'adcheck',
          leadType: 'lead_magnet',
          email: emailInput.value.trim(),
          phone: phoneInput ? phoneInput.value.trim() : '',
          metadata: {
            docTitle: docTitle || '2026 전문직 법정 광고 금칙어 500제 모음집 (PDF)',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        form.style.display = 'none';
        if (successBox) {
          successBox.classList.add('show');
          successBox.innerHTML = `
            <div style="font-size:24px; margin-bottom:6px;">🎉</div>
            <div style="font-weight:800; font-size:15px; margin-bottom:4px;">가이드북 신청 완료!</div>
            <div style="font-size:12.5px; line-height:1.5;">
              <b>${data.email}</b>으로 신청하신 자료가 순차 발송됩니다.<br>
              (담당 연구팀에 실시간 알림이 안전하게 전송되었습니다.)
            </div>
          `;
        }
      } else {
        alert(data.error || '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  };

  // Init modals on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureModals);
  } else {
    ensureModals();
  }
})();
