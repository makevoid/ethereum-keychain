// NOTE:
// ths test is configured to use real xDAIs
// #lazyprogrammer #cheapalts #btcln-soon!!
const c = console // (sorry :D)

const { Keychain } = require('./ethereum-keychain')

// const NODE_JS = true
const NODE_JS = false

let wallet
// wallet = new Keychain({ store: localStorage }) // browser

// todo, move in: eth-keychain-phone-keychain.js

class CordovaStore {
  constructor() {
    this.storeCordova = // ...
  }

  get store() {
    return this.storeCordova
  }
}

module.exports = {
  CordovaStore: CordovaStore,
}


const { CordovaStore } = require('eth-keychain-phone-keychain')
wallet = new Keychain({ store: { CORDOVA: new CordovaStore().store } }) // cordova

// generic, you can't send funds thou with this :D, you need to store your private key to be able to send
// const wallet = new Keychain({ store: {} })

wallet.info()

;(async () => {

  try {
    await wallet.netInfo()
    await wallet.selfTXTest() // the send code is contained in this function, it does a small transaction to your address, the nice thing of xdai is that a transaction costs 0.03 cents
    await wallet.netInfo()
    const process = require('process')
    process.exit()
  } catch (err) {
    c.log("Caught async error")
    c.error(err)
    c.error(err.stack)
  }

})()
