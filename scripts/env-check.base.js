const args = process.argv.slice(2)
const bootpayAppId = process.env.BOOTPAY_ID
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

function createEnvFile(fileName) {
  const envPath = path.join(projectRoot, fileName)

  if (fs.existsSync(envPath)) {
    // 파일이 존재하면 내용을 읽어서 키 존재 여부 확인
    const content = fs.readFileSync(envPath, 'utf-8')

    // VITE_BOOTPAY_APPLICATION_ID 키가 없으면 추가
    if (!content.includes('VITE_BOOTPAY_APPLICATION_ID')) {
      const newLine = `\nVITE_BOOTPAY_APPLICATION_ID = ${bootpayAppId || ''}\n`
      fs.appendFileSync(envPath, newLine)
    }
    return
  }

  const defaultContent = `# Environment Variables
  # Auto-generated on ${new Date().toLocaleString()}

  # API Configuration
  VITE_BOOTPAY_APPLICATION_ID = ${bootpayAppId || ''}
  `
  fs.writeFileSync(envPath, defaultContent)
}

export default createEnvFile
