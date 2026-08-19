/**
 * 일회용/임시 이메일 도메인 차단 목록 (Disposable Email Blacklist)
 * 어뷰저들이 3회 무료 크레딧을 무한 파밍하는 것을 방어합니다.
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // 대표적인 일회용 임시 메일 서비스 도메인들
  'tempmail.com',
  'temp-mail.org',
  'tempmail.net',
  'tempmailaddress.com',
  '10minutemail.com',
  '10minutemail.net',
  '10minmail.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.biz',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'spam4.me',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'cool.fr.nf',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'trashmail.org',
  'throwawaymail.com',
  'getairmail.com',
  'dispostable.com',
  'burnermail.io',
  'mohmal.com',
  'mytemp.email',
  'fakeinbox.com',
  'crazymailing.com',
  'generator.email',
  'emailondeck.com',
  'fakemailgenerator.com',
  'inboxkitten.com',
  'nada.ltd',
  'getnada.com',
  'dropmail.me',
  'inboxbear.com',
  'zillamail.com',
  'maildrop.cc',
  'discard.email',
  'discardmail.com',
  'spambox.us',
  'tempinbox.com',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'einrot.com',
  'chacuo.net',
  'mailnesia.com',
  'tempm.com',
])

/**
 * 이메일 주소가 일회용/임시 메일인지 검사
 */
export function isDisposableEmail(email: string): { isDisposable: boolean; reason?: string } {
  if (!email || !email.includes('@')) {
    return { isDisposable: false }
  }

  const parts = email.trim().toLowerCase().split('@')
  if (parts.length !== 2) {
    return { isDisposable: false }
  }

  const domain = parts[1]

  // 1. 도메인 정확 일치 검사
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isDisposable: true,
      reason: '일회용 임시 이메일 주소는 가입이 제한됩니다.',
    }
  }

  // 2. temp, fake, trash, throwaway 등 의심 서브도메인 검사
  const suspiciousPrefixes = ['temp', 'trash', 'fake', 'disposable', '10min', 'guerrilla', 'mailinator']
  for (const prefix of suspiciousPrefixes) {
    if (domain.startsWith(prefix) && (domain.endsWith('.com') || domain.endsWith('.net') || domain.endsWith('.org') || domain.endsWith('.io'))) {
      return {
        isDisposable: true,
        reason: '비정상적인 임시 이메일 도메인은 가입이 제한됩니다.',
      }
    }
  }

  return { isDisposable: false }
}

/**
 * 이메일 및 비밀번호 가입 유효성 종합 검사
 */
export function validateSignUpInput(email: string, password: string, passwordConfirm?: string) {
  if (!email || !email.trim()) {
    return { isValid: false, error: '이메일 주소를 입력해 주세요.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: '올바른 이메일 형식(예: name@naver.com)을 입력해 주세요.' }
  }

  const disposableCheck = isDisposableEmail(email)
  if (disposableCheck.isDisposable) {
    return {
      isValid: false,
      error: '일회용 임시 이메일은 가입이 제한됩니다. 네이버(@naver.com), 구글(@gmail.com), 카카오/다음 등 공식 이메일을 입력해 주세요.',
    }
  }

  if (!password || password.length < 6) {
    return { isValid: false, error: '비밀번호는 최소 6자리 이상으로 설정해 주세요.' }
  }

  if (passwordConfirm !== undefined && password !== passwordConfirm) {
    return { isValid: false, error: '비밀번호 확인이 일치하지 않습니다.' }
  }

  return { isValid: true }
}
