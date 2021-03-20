// force example on cTH network

process.env.CTH = "1"

const { Keychain } = require('./ethereum-keychain')

const { readFileSync } = require('fs')
const pvtKey = readFileSync('./.private-key.txt').toString().trim()

if (!pvtKey) {
  console.error("private key is empty - generate, backup and load a private key first")
  process.exit(1)
}

wallet = new Keychain({ store: { "__ethereum-keychain_": pvtKey } })

wallet.info()

;(async () => {

  await wallet.netInfo()

  console.log("sending transaction to self")
  await wallet.sendTXSelf()

  await wallet.netInfo()
  const process = require('process')
  process.exit()

})()
