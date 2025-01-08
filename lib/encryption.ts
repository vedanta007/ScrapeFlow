import crypto from 'crypto'
import 'server-only'

const ALG = 'aes-256-cbc' // key length 32 bytes
// openssl rand -hex 32
// https://generate-random.ord/encryption-key-generator

export const symmetricEncrypt = (data: string) => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key not found')
    }

    // Generate a random IV
    const iv = crypto.randomBytes(16)
    // Create a cipher
    const cipher = crypto.createCipheriv(ALG, Buffer.from(key, 'hex'), iv)
    // Encrypt the data
    let encrypted = cipher.update(data)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const symmetricDecrypt = (encrypted: string) => {
    const key = process.env.ENCRYPTION_KEY
    if (!key) {
        throw new Error('Encryption key not found')
    }

    const [iv, data] = encrypted.split(':')
    // Create a decipher
    const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
    let decrypted = decipher.update(Buffer.from(data, 'hex'))
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
}