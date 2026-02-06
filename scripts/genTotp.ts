import 'dotenv/config'
import {generateTotpPublic} from '../src/lib/totp/generateTotpPublic.js'

async function run() {
  console.log('Generating totp code')
  const result = await generateTotpPublic("74WN7OSYRBIVPL7JR6VGGHQWABX67YSDKJNHG2RHNANUDIDP4RRWSTTKN7H4DGWHG6CZOXO45FJRHD6D")



  console.log(result)
  process.exit(0)
}

run().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
