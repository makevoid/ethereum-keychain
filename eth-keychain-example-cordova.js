// todo, move KeychainStoreMobile in: eth-keychain-mobile-keychain.js

// mobile keychain using a cordova secure secret storage
//
class KeychainStoreMobile {
  constructor() {
    this.storeCordova = { TODO: true } // todo: implementationf or cordova using cordova-secret-store
  }

  get store() {
    return this.storeCordova
  }
}

module.exports = {
  KeychainStoreMobile: KeychainStoreMobile,
}

// const { KeychainStoreMobile } = require('eth-keychain-store-mobile')

//  main

const { Keychain } = require('./ethereum-keychain')
const cordovaStore = new KeychainStoreMobile().store
const wallet = new Keychain({
  store: { codova: cordovaStore }
}) // cordova

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
