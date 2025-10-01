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
