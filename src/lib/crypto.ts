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
