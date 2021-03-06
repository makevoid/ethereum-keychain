// NOTE:
// ths test is configured to use real xDAIs
// #lazyprogrammer #cheapalts

const { Keychain } = require('./ethereum-keychain')

// new Keychain

// const NODE_JS = true
const NODE_JS = false

let wallet

// nodejs
if (NODE_JS) {
  const { readFileSync } = require('fs')
  const pvtKey = readFileSync('./.private-key.txt').toString().trim()
  wallet = new Keychain({ store: { "__ethereum-keychain_": pvtKey } })
} else {
  wallet = new Keychain({ store: localStorage })
}
// const wallet = new Keychain({ store: {} })
wallet.info()

;(async () => {
  console.log("netinfo")
  await wallet.netInfo()
  console.log("sendTXSelf")
  await wallet.sendTXSelf()
  console.log("netInfo")
  await wallet.netInfo()
})()

// new Keychain({ store: localStorage }) // browser
