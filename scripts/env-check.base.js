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
    // 파일이 존재하면 내용을 읽어서 VITE_BOOTPAY_APPLICATION_ID 라인 삭제
    let content = fs.readFileSync(envPath, 'utf-8')
    const lines = content.split('\n')
    const filteredLines = lines.filter(
      (line) => !line.includes('VITE_BOOTPAY_APPLICATION_ID')
    )

    // VITE_BOOTPAY_APPLICATION_ID 추가
    filteredLines.push(`VITE_BOOTPAY_APPLICATION_ID=${bootpayAppId || ''}`)
    fs.writeFileSync(envPath, filteredLines.join('\n'))
    return
  }

  const defaultContent = `# Environment Variables
  # Auto-generated on ${new Date().toLocaleString()}

  # API Configuration
  VITE_BOOTPAY_APPLICATION_ID=${bootpayAppId || ''}
  `
  fs.writeFileSync(envPath, defaultContent)
}

export default createEnvFile
