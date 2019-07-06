// NOTE:
// ths test is configured to use real xDAIs
// #lazyprogrammer #cheapalts #btcln-soon!!
const c = console // (sorry :D)

const { Keychain } = require('./ethereum-keychain')

// const NODE_JS = true
const NODE_JS = false

let wallet
// wallet = new Keychain({ store: localStorage }) // browser


const wallet = new Keychain({ store: {} })

wallet.info()

;(async () => {

  try {
    await wallet.netInfo()
    await wallet.selfTXTest()
    await wallet.netInfo()
    const process = require('process')
    process.exit()
  } catch (err) {
    c.log("Caught async error")
    c.error(err)
    c.error(err.stack)
  }

})()
