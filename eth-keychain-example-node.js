// NOTE:
// ths test is configured to use real xDAIs
// #lazyprogrammer #cheapalts #btcln-soon!!
const { Keychain } = require('./ethereum-keychain')

const wallet = new Keychain({ store: {} })

wallet.info()

;(async () => {

  try {
    await wallet.netInfo()
    await wallet.sendTXSelf()
    await wallet.netInfo()
    const process = require('process')
    process.exit()
  } catch (err) {
    c.log("Caught async error")
    c.error(err)
    c.error(err.stack)
  }

})()
