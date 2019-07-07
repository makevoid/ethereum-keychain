const { gasPriceDefault } = require('./eth-keychain-lib')
const bitcoin = require('bitcoinjs-lib') // we use btc keys and bip39 (btc keys are a subset of all possible ethereum keys)
const bip39   = require("bip39")
const wif     = require('wif')
// init web3
const Web3    = require("web3")

// console.log("config", require('./configs'))
const { RPC_HOST } = require('./configs')

// exception definition

const { txAttrsXDai, resolveTxHash } = require('./eth-keychain-lib')
const { KeychainError, PrivateKeyLoadError } = require('./eth-keychain-errors')

// main

class Keychain {
  constructor({ store }) {
    if (!store) console.warn("Using localstorage")
    this.Store = { store }
    this.web3 = this.initWeb3()
    this.eth = this.web3.eth
    this.web3Accounts = this.eth.accounts

    if (this.boom) throw new KeychainError
    this.initMisc()
    this.loadOrGeneratePrivateKey()
    this.web3Account = this.loadWeb3Account()
    this.address = this.deriveAddress()
  }

  initMisc() {
    this.storedKeyString = "__ethereum-keychain_"
  }

  // loads a web3 account from a btc bitcoinjs-lib generated private key
  loadWeb3Account() {
    const privateKey = wif.decode(this.pvtKey.toWIF()).privateKey
    const privateKeyEth = `${"0x"}${privateKey.toString("hex")}`
    // this.logPrivateKeys({ privateKey, privateKeyEth })
    const account = this.web3Accounts.privateKeyToAccount(privateKey)
    this.pvtKeyEth = account.privateKey
    // this.logAccount({ account })
    return account
  }

  deriveAddress() {
    return this.web3Account.address
  }

  // loadOrGeneratePrivateKey

  loadOrGeneratePrivateKey() {
    const key = this.storedKey
    if (key && key != '') {
      this.pvtKey = this.loadPrivateKey()
    } else {
      const newKey = this.generatePrivateKey()
      this.saveKey(newKey)
      this.pvtKey = newKey
    }
  }

  // loadOrGeneratePrivateKey "libs"
  // TODO: refactor away

  get storedKey() {
    return this.store[this.storedKeyString]
  }

  generatePrivateKey() {
    return bitcoin.ECPair.makeRandom()
  }

  loadPrivateKey() {
    return bitcoin.ECPair.fromWIF(this.storedKey)
  }

  saveKey(key) {
    this.store[this.storedKeyString] = key.toWIF()
  }

  // store

  set Store({ store }) {
    this.store = store || localStorage
    this.store.init = true
    console.warn("wallet initialized")
    this.store
  }

  // info

  info() {
    console.log("Address:", this.address)
  }

  async netInfo() {
    const info = {}
    info.address    = this.address
    info.balance    = await this.eth.getBalance(this.address)
    info.balanceEth = this.web3.utils.fromWei(info.balance, "ether")
    info.blockNum   = await this.eth.getBlockNumber()
    const block     = await this.eth.getBlock(info.blockNum)
    info.blockHash  = block.hash
    if (this.eth.getChainId) info.chainId = await this.eth.getChainId()
    console.log("Info:", JSON.stringify(info, null, 2))
    return info
  }

  // init web3

  initWeb3() {
    const rpcHost = RPC_HOST
    const rpcPort = "8545" // default
    console.log("RPC_HOST:", rpcHost)
    const web3 = new Web3(`http://${rpcHost}:${rpcPort}`)
    return web3
  }

  async send({ to, value }) {
    console.log("constructing tx")
    const txAttrs = txAttrsXDai({ to: this.address, value: 1000000000000 })
    const rawTx = await this.signTx(txAttrs, this.pvtKeyEth)
    // console.log("rawTx:", rawTx)
    console.log("submitting tx...")
    const txHashPromise = this.eth.sendSignedTransaction(rawTx)
    return resolveTxHash(txHashPromise)
  }

  signTx(txAttrs, privateKey) {
    return new Promise((resolve, reject) => {
      const txCallback = (err, signedTx) => {
        // console.log("signedTx:", signedTx)
        if (err) return reject(err)
        if (!signedTx.rawTransaction) return reject(new Error("NoRawTransactionError"))
        resolve(signedTx.rawTransaction)
      }
      this.web3Accounts.signTransaction(txAttrs, privateKey, txCallback)
    })
  }

  async sendTXSelf() {
    const txHash = await this.send({ to: this.address, value: 1000000000000 })
    console.log("TX:", txHash)
    return true
  }

  // for debugging purposes only, running this will reveal the private key in the program's output

  logPrivateKeys({ privateKey, privateKeyEth }) {
    console.log("privateKey:", privateKey)
    console.log("privateKey (BTC - WIF):", this.pvtKey.toWIF())
    console.log("privateKeyEth:", privateKeyEth)
  }

  logAccount({ account }){
    const { inspect } = require('util')
    console.log("account:", inspect(account).slice(0, 85))
  }

}

module.exports = {
  Keychain: Keychain
}

if (window) { // browserify export
  window.Keychain = Keychain
}
