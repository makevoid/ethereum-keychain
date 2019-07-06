// NOTE:
// ths test is configured to use real xDAIs
// #lazyprogrammer #cheapalts #btcln-soon!!
const { Keychain } = require('./ethereum-keychain')

const { readFileSync } = require('fs')
const pvtKey = readFileSync('./.private-key.txt').toString().trim()
wallet = new Keychain({ store: { "__ethereum-keychain_": pvtKey } })

wallet.info()

;(async () => {

  await wallet.netInfo()
  await wallet.sendTXSelf()
  await wallet.netInfo()
  const process = require('process')
  process.exit()

})()
