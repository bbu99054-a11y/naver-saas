/**
 * PostSync Web Tools Monetization Common Client Script (2026)
 * Handles: Lead Magnet submission, Ebook TOC preview modal, Bank Transfer order modal
 */

(function () {
  // Common Bank Info (Synced with PostSync billing system)
  // Common Bank Info (Synced with PostSync billing system)
  const BANK_INFO = {
    bankName: '국민은행',
    accountNumber: '93043922640',
    holder: '유영무',
    amount: 39000,
    formattedAmount: '39,000원',
    bookTitle: '2026 변호사·세무사 네이버 상위 1% 인바운드 마케팅 실전 지침서 (PDF)',
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
          <h3 class="mz-modal-title">📖 『2026 변호사·세무사 네이버 상위 1% 인바운드 마케팅 실전 지침서』 핵심 목차</h3>
          <button type="button" class="mz-modal-close" onclick="closeMonetizationModal()">&times;</button>
        </div>
        <div class="mz-modal-body">
          <div style="font-size:12.5px; color:#475569; margin-bottom:16px; line-height:1.5;">
            현직 변호사·세무사 및 대행사들이 쉬쉬하는 <b>스마트플레이스 1위 선점 & 2026 합법 광고 규정 & 복붙 칼럼 6종</b>을 집대성한 초압축 실전 지침서입니다.
          </div>
          
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 1. [생존] 변협·세무사회 징계 0건! 2026 합법 광고 컴플라이언스</div>
            <div class="mz-toc-desc">변호사법 제23조·세무사법 제12조 단속 피하는 1초 치환 족보 30선 & 스마트플레이스 소개글 주의보</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 2. [지역 점유] 네이버 스마트플레이스 1~3위 장악 공식</div>
            <div class="mz-toc-desc">불법 슬롯 없이 지도 상위권 지키는 2,000자 소개글 템플릿, 대표 키워드 5개 & 사진 15장 세팅법</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 3. [노출 & 신뢰] 2026 E-E-A-T & 스마트블록 상위노출 메커니즘</div>
            <div class="mz-toc-desc">대행사 알바생 원고가 버림받는 이유, 2026 GEO 두괄식 서술법 & 8종 벤토 인포그래픽 카드 배치</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 4. [복붙 템플릿] 의뢰인을 홀리는 분야별 실전 칼럼 6선</div>
            <div class="mz-toc-desc">변호사 3종(음주운전 양형자료, 이혼 재산분할 기여도, 전세사기 임차권등기) & 세무사 3종(법인기장 절세, 상속증여세 3년 플랜, 세무조사 소명)</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 5. [전환/수임] 읽자마자 전화 걸게 만드는 3단계 인바운드 콜(Call) 설계</div>
            <div class="mz-toc-desc">손실 회피(Loss Aversion) 트리거, 스마트콜 직통 연결 & 첫 1분 통화로 방문 수임 성사시키는 스크립트</div>
          </div>
          <div class="mz-toc-item">
            <div class="mz-toc-title">Chapter 6. [주 1회 루틴] 30분 만에 끝내는 인바운드 수임 파이프라인 관리</div>
            <div class="mz-toc-desc">대표님은 재판과 절세 상담에만 집중하세요. 주 1회 30분 관리로 네이버 상위 1% 잠재 의뢰인의 인바운드 수임 동선을 완성합니다.</div>
          </div>
          <div class="mz-toc-item" style="background:#f8fafc; border-left:3px solid #2563eb;">
            <div class="mz-toc-title" style="color:#2563eb;">[권말 부록] 2026 황금 키워드 50선 & 플레이스 1위 자가점검표 25제</div>
            <div class="mz-toc-desc">사무실 컴퓨터 옆에 두고 바로 꺼내 쓰는 변호사 25개 / 세무사 25개 즉시 수임 키워드 모음</div>
          </div>

          <div style="margin-top:20px;">
            <button type="button" class="btn-ebook-order" onclick="openEbookOrderModal()">
              <i class="fa-solid fa-credit-card"></i> <span>39,000원에 실전 지침서 평생 소장하기</span>
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
              <label for="mzOrderPhone"><i class="fa-solid fa-phone"></i> 연락처 (필수 - 입금 확인 알림용)</label>
              <input type="tel" id="mzOrderPhone" class="mz-form-input" placeholder="010-0000-0000" required>
            </div>

            <!-- 현금영수증 / 세금계산서 발행 선택 (메인 도메인 연동) -->
            <div class="mz-form-group">
              <label><i class="fa-solid fa-receipt"></i> 현금영수증 / 세금계산서 발행</label>
              <div class="mz-tax-group">
                <label class="mz-tax-label active" id="mzTaxLabelPersonal">
                  <input type="radio" name="mzTaxType" value="PERSONAL" checked onchange="handleTaxTypeChange(this.value)">
                  <span>개인 소득공제</span>
                </label>
                <label class="mz-tax-label" id="mzTaxLabelBusiness">
                  <input type="radio" name="mzTaxType" value="BUSINESS" onchange="handleTaxTypeChange(this.value)">
                  <span>사업자 증빙 (세금계산서)</span>
                </label>
                <label class="mz-tax-label" id="mzTaxLabelNone">
                  <input type="radio" name="mzTaxType" value="NONE" onchange="handleTaxTypeChange(this.value)">
                  <span>미발행</span>
                </label>
              </div>
              <div class="mz-tax-input-wrap" id="mzTaxNumWrap">
                <input type="text" id="mzTaxNum" class="mz-form-input" placeholder="현금영수증용 휴대폰 번호 ('-' 제외)" style="font-size:12.5px;">
              </div>
            </div>

            <button type="submit" class="btn-ebook-order" id="mzBtnSubmitOrder" style="padding:13px; font-size:14px; margin-top:16px;">
              <i class="fa-solid fa-check-circle"></i> <span>입금 신청 완료 및 주문 접수</span>
            </button>

            <div class="mz-order-notice">
              💡 <b>안내:</b> 신청 접수 후 위 국민은행 계좌로 입금해 주시면, 입금 확인 즉시(평균 10분 이내) 기재하신 이메일로 전자책 원본 발송 및 요청하신 계산서/영수증이 발행됩니다.
            </div>
          </form>

          <div id="mzOrderSuccessBox" style="display:none; text-align:center; padding:20px 10px;">
            <div style="font-size:36px; margin-bottom:12px;">🎉</div>
            <h4 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:6px;">입금 신청이 정상 접수되었습니다!</h4>
            <p style="font-size:13px; color:#475569; line-height:1.6; margin-bottom:16px;" id="mzOrderSuccessMsg">
              위 <b>${BANK_INFO.bankName} ${BANK_INFO.accountNumber} (예금주: ${BANK_INFO.holder})</b> 계좌로 <b>${BANK_INFO.formattedAmount}</b>을 입금해 주시면 입금 확인 즉시 이메일로 전자책이 전송되며 요청하신 증빙이 발행됩니다.
            </p>
            <button type="button" class="btn-ebook-preview" onclick="closeMonetizationModal()">확인 완료</button>
          </div>
        </div>
      </div>

      <!-- 3. Free Quick Guide Modal (Standalone popup for lead magnet) -->
      <div class="mz-modal-dialog" id="mzLeadDialog" style="display:none; max-width:460px;">
        <div class="mz-modal-header" style="background:#f0fdf4; border-bottom:1px solid #bbf7d0;">
          <h3 class="mz-modal-title" style="color:#14532d; font-size:15.5px;"><i class="fa-solid fa-gift" style="color:#16a34a;"></i> [무료 퀵가이드] 네이버 플레이스 1위 & 칼럼 템플릿</h3>
          <button type="button" class="mz-modal-close" onclick="closeMonetizationModal()">&times;</button>
        </div>
        <div class="mz-modal-body">
          <div style="font-size:12.5px; color:#166534; margin-bottom:14px; line-height:1.55;">
            대행사 위약금 날리기 전 필독! 단 10분 만에 지도 1~3위 장악하는 <b>3분 체크리스트</b>와 즉시 복사해 쓰는 <b>합법 수임 칼럼 템플릿 2선(PDF)</b>을 이메일로 1초 만에 무료 발송해 드립니다.
          </div>
          <form id="mzLeadModalForm" onsubmit="handleModalLeadSubmit(event)">
            <div class="mz-form-group">
              <label for="mzLeadModalEmail"><i class="fa-solid fa-envelope"></i> 받아보실 이메일 (필수)</label>
              <input type="email" id="mzLeadModalEmail" class="mz-form-input" placeholder="name@example.com" required>
            </div>
            <div class="mz-form-group">
              <label for="mzLeadModalPhone"><i class="fa-solid fa-phone"></i> 연락처 (선택 - 알림용)</label>
              <input type="tel" id="mzLeadModalPhone" class="mz-form-input" placeholder="010-0000-0000">
            </div>
            <button type="submit" class="btn-lead-submit" id="mzBtnModalLeadSubmit" style="width:100%; justify-content:center; padding:12px; font-size:13.5px; margin-top:8px;">
              <i class="fa-solid fa-download"></i> <span>무료 퀵가이드 1초 받기</span>
            </button>
          </form>
          <div id="mzLeadModalSuccessBox" style="display:none; text-align:center; padding:16px 10px; color:#15803d;">
            <div style="font-size:28px; margin-bottom:8px;">🎉</div>
            <h4 style="font-size:16px; font-weight:800; margin-bottom:4px;">가이드북 신청 완료!</h4>
            <p style="font-size:12.5px; color:#166534; line-height:1.5;" id="mzLeadModalSuccessMsg"></p>
            <button type="button" class="btn-ebook-preview" style="margin-top:12px;" onclick="closeMonetizationModal()">확인 완료</button>
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
    const leadDlg = document.getElementById('mzLeadDialog');
    if (leadDlg) leadDlg.style.display = 'none';
  };

  // 3. Open Ebook Order Modal
  window.openEbookOrderModal = function () {
    ensureModals();
    document.getElementById('mzModalOverlay').classList.add('open');
    document.getElementById('mzTocDialog').style.display = 'none';
    document.getElementById('mzOrderDialog').style.display = 'block';
    document.getElementById('mzOrderForm').style.display = 'block';
    document.getElementById('mzOrderSuccessBox').style.display = 'none';
    const leadDlg = document.getElementById('mzLeadDialog');
    if (leadDlg) leadDlg.style.display = 'none';
  };

  // 4. Open Standalone Lead Magnet Modal
  window.openLeadMagnetModal = function (toolSource, docTitle) {
    ensureModals();
    window._mzCurrentToolSource = toolSource || 'adcheck';
    window._mzCurrentDocTitle = docTitle || '[무료 퀵가이드] 네이버 플레이스 1위 세팅법 & 변호사·세무사 합법 수임 칼럼 템플릿 (PDF)';
    document.getElementById('mzModalOverlay').classList.add('open');
    document.getElementById('mzTocDialog').style.display = 'none';
    document.getElementById('mzOrderDialog').style.display = 'none';
    const leadDlg = document.getElementById('mzLeadDialog');
    if (leadDlg) {
      leadDlg.style.display = 'block';
      const form = document.getElementById('mzLeadModalForm');
      const successBox = document.getElementById('mzLeadModalSuccessBox');
      if (form) form.style.display = 'block';
      if (successBox) successBox.style.display = 'none';
    }
  };

  // 5. Close Modal
  window.closeMonetizationModal = function () {
    const overlay = document.getElementById('mzModalOverlay');
    if (overlay) {
      overlay.classList.remove('open');
    }
  };

  // 6. Handle Tax Deduction Radio Change
  window.handleTaxTypeChange = function (val) {
    const wrap = document.getElementById('mzTaxNumWrap');
    const input = document.getElementById('mzTaxNum');
    const labelP = document.getElementById('mzTaxLabelPersonal');
    const labelB = document.getElementById('mzTaxLabelBusiness');
    const labelN = document.getElementById('mzTaxLabelNone');

    if (labelP) labelP.classList.toggle('active', val === 'PERSONAL');
    if (labelB) labelB.classList.toggle('active', val === 'BUSINESS');
    if (labelN) labelN.classList.toggle('active', val === 'NONE');

    if (!wrap || !input) return;

    if (val === 'PERSONAL') {
      wrap.style.display = 'block';
      input.placeholder = "현금영수증용 휴대폰 번호 ('-' 제외)";
      input.required = false;
    } else if (val === 'BUSINESS') {
      wrap.style.display = 'block';
      input.placeholder = "세금계산서용 사업자등록번호 (10자리)";
      input.required = true;
    } else {
      wrap.style.display = 'none';
      input.value = '';
      input.required = false;
    }
  };

  // 7. Copy Bank Account Number
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

  // 8. Handle Ebook Order Submit
  window.handleEbookOrderSubmit = async function (e) {
    e.preventDefault();
    const name = document.getElementById('mzOrderName').value.trim();
    const email = document.getElementById('mzOrderEmail').value.trim();
    const phone = document.getElementById('mzOrderPhone').value.trim();
    const btn = document.getElementById('mzBtnSubmitOrder');

    // Tax Deduction Info
    const taxRadio = document.querySelector('input[name="mzTaxType"]:checked');
    const taxType = taxRadio ? taxRadio.value : 'PERSONAL';
    const taxNumInput = document.getElementById('mzTaxNum');
    const taxNum = taxNumInput ? taxNumInput.value.trim() : '';

    if (!name || !email) {
      alert('입금자명과 이메일 주소를 정확히 입력해 주세요.');
      return;
    }

    if (!phone) {
      alert('입금 확인 및 안내를 위해 연락처(휴대폰 번호)를 입력해 주세요.');
      return;
    }

    if (taxType === 'BUSINESS' && !taxNum) {
      alert('세금계산서 발행을 위해 사업자등록번호(10자리)를 입력해 주세요.');
      if (taxNumInput) taxNumInput.focus();
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 접수 처리 중...';

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
          taxDeductionType: taxType,
          taxDeductionNum: taxNum || phone,
          metadata: {
            bookTitle: BANK_INFO.bookTitle,
            amount: BANK_INFO.amount,
            bank: `${BANK_INFO.bankName} ${BANK_INFO.accountNumber} (${BANK_INFO.holder})`,
            taxDeductionType: taxType,
            taxDeductionNum: taxNum || phone,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        document.getElementById('mzOrderForm').style.display = 'none';
        const successBox = document.getElementById('mzOrderSuccessBox');
        const successMsg = document.getElementById('mzOrderSuccessMsg');
        if (successMsg) {
          const proofText = taxType === 'BUSINESS'
            ? `사업자 세금계산서 (${taxNum})`
            : taxType === 'PERSONAL'
            ? `개인 현금영수증 (${taxNum || phone})`
            : '미발행';

          successMsg.innerHTML = `
            위 <b>${BANK_INFO.bankName} ${BANK_INFO.accountNumber} (예금주: ${BANK_INFO.holder})</b> 계좌로 <b>${BANK_INFO.formattedAmount}</b>을 입금해 주시면 입금 확인 즉시(평균 10분 이내) <b>${email}</b>으로 전자책 원본이 전송됩니다.<br><br>
            <span style="display:inline-block; background:#f1f5f9; padding:6px 12px; border-radius:6px; font-size:12px; color:#334155;">
              🧾 <b>신청 증빙:</b> ${proofText}
            </span>
          `;
        }
        if (successBox) successBox.style.display = 'block';
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

  // 9. Handle Modal Lead Magnet Submit
  window.handleModalLeadSubmit = async function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('mzLeadModalEmail');
    const phoneInput = document.getElementById('mzLeadModalPhone');
    const submitBtn = document.getElementById('mzBtnModalLeadSubmit');
    const form = document.getElementById('mzLeadModalForm');
    const successBox = document.getElementById('mzLeadModalSuccessBox');
    const successMsg = document.getElementById('mzLeadModalSuccessMsg');

    if (!emailInput || !emailInput.value.trim()) {
      alert('가이드북을 받아보실 이메일을 입력해 주세요.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSource: window._mzCurrentToolSource || 'adcheck',
          leadType: 'lead_magnet',
          email: emailInput.value.trim(),
          phone: phoneInput ? phoneInput.value.trim() : '',
          metadata: {
            docTitle: window._mzCurrentDocTitle || '[무료 퀵가이드] 네이버 플레이스 1위 세팅법 & 변호사·세무사 합법 수임 칼럼 템플릿 (PDF)',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (form) form.style.display = 'none';
        if (successBox) {
          successBox.style.display = 'block';
          if (successMsg) {
            successMsg.innerHTML = `<b>${data.email}</b>으로 무료 퀵가이드가 순차 발송됩니다.`;
          }
        }
      } else {
        alert(data.error || '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-download"></i> <span>무료 퀵가이드 1초 받기</span>';
    }
  };

  // 10. Handle Inline Lead Magnet Submit
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
            docTitle: docTitle || '[무료 퀵가이드] 네이버 플레이스 1위 세팅법 & 변호사·세무사 합법 수임 칼럼 템플릿 (PDF)',
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
