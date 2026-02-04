import 'dotenv/config'
import {generateTotpPublic} from '../src/lib/totp/generateTotpPublic.js'

async function run() {
  console.log('Generating totp code')
  const result = await generateTotpPublic("key")



  console.log(result)
  process.exit(0)
}

run().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
