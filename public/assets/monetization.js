/**
 * PostSync Web Tools Monetization Common Client Script (2026)
 * Handles: Free Lead Magnet submission & modal handling (Zero-Ebook Architecture)
 */

(function () {
  // 모달 DOM 강제 주입 방지 스위치
  const IS_MONETIZATION_DOM_AUTORUN = false;

  function mzNotify(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    let t = document.getElementById('globalToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'globalToast';
      t.className = 'toast-box';
      document.body.appendChild(t);
    }
    t.innerHTML = `<i class="fa-solid fa-circle-info" style="color:#60a5fa;"></i> <span>${msg}</span>`;
    t.classList.add('show');
    setTimeout(() => { t.classList.remove('show'); }, 2500);
  }

  // 1. Modal DOM Injection (무료 퀵가이드/리포트 리드 모달 전용)
  function ensureModals(forceInject) {
    if (!IS_MONETIZATION_DOM_AUTORUN && !forceInject) return;
    if (document.getElementById('mzModalOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'mzModalOverlay';
    overlay.className = 'mz-modal-overlay';
    overlay.onclick = function (e) {
      if (e.target === overlay) closeMonetizationModal();
    };

    overlay.innerHTML = `
      <!-- Free Quick Guide Modal (Standalone popup for lead magnet) -->
      <div class="mz-modal-dialog" id="mzLeadDialog" style="display:none; max-width:460px;">
        <div class="mz-modal-header" style="background:#f0fdf4; border-bottom:1px solid #bbf7d0;">
          <h3 class="mz-modal-title" style="color:#14532d; font-size:15.5px;"><i class="fa-solid fa-gift" style="color:#16a34a;"></i> [무료 퀵가이드] 네이버 플레이스 1위 & 칼럼 템플릿</h3>
          <button type="button" class="mz-modal-close" onclick="closeMonetizationModal()" aria-label="닫기" title="닫기">&times;</button>
        </div>
        <div class="mz-modal-body">
          <div style="font-size:12.5px; color:#166534; margin-bottom:14px; line-height:1.55;">
            단 10분 만에 지도 1~3위 장악하는 <b>3분 체크리스트</b>와 즉시 복사해 쓰는 <b>합법 수임 칼럼 템플릿 2선(PDF)</b>을 이메일로 1초 만에 무료 발송해 드립니다.
          </div>
          <form id="mzLeadModalForm" onsubmit="handleModalLeadSubmit(event)">
            <div class="mz-form-group">
              <label for="mzLeadModalEmail"><i class="fa-solid fa-envelope"></i> 받아보실 이메일 (필수)</label>
              <input type="email" id="mzLeadModalEmail" class="mz-form-input" placeholder="name@example.com" maxlength="100" required>
            </div>
            <div class="mz-form-group">
              <label for="mzLeadModalPhone"><i class="fa-solid fa-phone"></i> 연락처 (선택 - 알림용)</label>
              <input type="tel" id="mzLeadModalPhone" class="mz-form-input" placeholder="010-0000-0000" maxlength="30">
            </div>
            <button type="submit" class="btn-lead-submit" id="mzBtnModalLeadSubmit" style="width:100%; justify-content:center; padding:12px; font-size:13.5px; margin-top:8px;">
              <i class="fa-solid fa-download"></i> <span>무료 퀵가이드 1초 받기</span>
            </button>
          </form>
          <div id="mzLeadModalSuccessBox" style="display:none; text-align:center; padding:16px 10px; color:#15803d;">
            <div style="font-size:28px; margin-bottom:8px;">🎉</div>
            <h4 style="font-size:16px; font-weight:800; margin-bottom:4px;">가이드북 신청 완료!</h4>
            <p style="font-size:12.5px; color:#166534; line-height:1.5;" id="mzLeadModalSuccessMsg"></p>
            <button type="button" class="btn-modal-confirm" style="margin-top:12px; padding:8px 16px; background:#16a34a; color:#fff; border:none; border-radius:6px; font-weight:700; cursor:pointer;" onclick="closeMonetizationModal()">확인 완료</button>
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

  // 2. Open Standalone Lead Magnet Modal
  window.openLeadMagnetModal = function (toolSource, docTitle) {
    ensureModals(true);
    window._mzCurrentToolSource = toolSource || 'adcheck';
    window._mzCurrentDocTitle = docTitle || '[무료 퀵가이드] 네이버 플레이스 1위 세팅법 & 변호사·세무사 합법 수임 칼럼 템플릿 (PDF)';
    const overlay = document.getElementById('mzModalOverlay');
    if (overlay) overlay.classList.add('open');
    const leadDlg = document.getElementById('mzLeadDialog');
    if (leadDlg) {
      leadDlg.style.display = 'block';
      const form = document.getElementById('mzLeadModalForm');
      const successBox = document.getElementById('mzLeadModalSuccessBox');
      if (form) form.style.display = 'block';
      if (successBox) successBox.style.display = 'none';
    }
  };

  // 3. Close Modal
  window.closeMonetizationModal = function () {
    const overlay = document.getElementById('mzModalOverlay');
    if (overlay) {
      overlay.classList.remove('open');
    }
  };

  // 4. Fallback handler (전자책 기능 제거에 따른 무료 리포트 연계)
  window.openEbookPreviewModal = function () {
    window.openLeadMagnetModal();
  };
  window.openEbookOrderModal = function () {
    window.openLeadMagnetModal();
  };

  // 5. Handle Modal Lead Magnet Submit
  window.handleModalLeadSubmit = async function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('mzLeadModalEmail');
    const phoneInput = document.getElementById('mzLeadModalPhone');
    const submitBtn = document.getElementById('mzBtnModalLeadSubmit');
    const form = document.getElementById('mzLeadModalForm');
    const successBox = document.getElementById('mzLeadModalSuccessBox');
    const successMsg = document.getElementById('mzLeadModalSuccessMsg');

    if (!emailInput || !emailInput.value.trim()) {
      mzNotify('가이드북을 받아보실 이메일을 입력해 주세요.');
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
        mzNotify(data.error || '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      mzNotify('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-download"></i> <span>무료 퀵가이드 1초 받기</span>';
    }
  };

  // 6. Handle Inline Lead Magnet Submit
  window.handleLeadMagnetSubmit = async function (e, toolSource, docTitle) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successBox = form.parentElement.querySelector('.lead-magnet-success');

    if (!emailInput || !emailInput.value.trim()) {
      mzNotify('가이드북을 받아보실 이메일을 입력해 주세요.');
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
        mzNotify(data.error || '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error(err);
      mzNotify('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
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
