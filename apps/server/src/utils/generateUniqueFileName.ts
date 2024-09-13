import { randomBytes } from 'node:crypto'

function generateUniqueFileName(extension: string): string {
  const randomBytesCount = 10
  const randomBytesBuffer = randomBytes(randomBytesCount)
  const randomString = randomBytesBuffer.toString('hex')
  const timestamp = Date.now()
  return `${timestamp}-${randomString}${extension}`
}

export default generateUniqueFileName
