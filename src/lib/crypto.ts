import crypto from 'crypto'

const rawKey = process.env.ENCRYPTION_KEY || (process.env.NODE_ENV !== 'production' ? 'postsynk_default_secret_key_32b!' : '')

if (!rawKey) {
  throw new Error('FATAL: ENCRYPTION_KEY 환경변수가 설정되지 않았습니다.')
}

// SHA-256 해시를 통해 어떤 길이의 키가 들어와도 항상 정확히 32바이트 AES-256 키 버퍼 생성
const KEY_BUFFER = crypto.createHash('sha256').update(rawKey).digest()
const IV_LENGTH = 16 

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', KEY_BUFFER, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(text: string) {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift()!, 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', KEY_BUFFER, iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

// 🛡️ 안전 암호화 (예외 발생 시 원본 보호 및 null 세이프)
export function safeEncrypt(text: string | null | undefined): string | null {
  if (!text) return null
  try {
    return encrypt(text)
  } catch (err) {
    console.warn('[Crypto] Encryption fallback to raw text:', err)
    return text
  }
}

// 🛡️ 안전 복호화 (이미 평문이거나 암호화 형식이 아닌 경우 원본 반환)
export function safeDecrypt(text: string | null | undefined): string {
  if (!text) return ''
  try {
    if (text.includes(':') && text.length > 32) {
      return decrypt(text)
    }
    return text
  } catch (err) {
    return text
  }
}
