const { gasPriceDefault } = require('./eth-keychain-lib')
const { fromWei, toWei }  = require("web3-utils")
const bitcoin = require('bitcoinjs-lib') // we use btc keys and bip39 (btc keys are a subset of all possible ethereum keys)
const bip39   = require("bip39")
const wif     = require('wif')
const Web3    = require("web3")

const { RPC_HOST, RPC_PORT } = require('./configs')

const { txAttrsCheapEthChains, resolveTxHash } = require('./eth-keychain-lib')
const { KeychainError, PrivateKeyLoadError } = require('./eth-keychain-errors')

// main class

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
    const account = this.web3Accounts.privateKeyToAccount(privateKeyEth)
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
    const rpcPort = RPC_PORT
    let rpcUrl = RPC_HOST
    if (rpcPort) rpcUrl = `${rpcHost}:${rpcPort}`
    console.log("rpcUrl:", rpcUrl)
    const web3 = new Web3(rpcUrl)
    return web3
  }

  async txBalancePreCheck({ value }) {
    let balance = await this.eth.getBalance(this.address)
    balance = new Number(balance)
    const oneGwei = toWei("1", "gwei")
    if (balance < oneGwei) {
      console.error("Error - minimum balance not reached, you cannot make a transaction from this address at the moment")
      process.exit(1)
    }
  }

  async txPreChecks({ value }) {
    await this.txBalancePreCheck({ value })
  }

  async send({ to, value }) {
    await this.txPreChecks({ value })

    console.log("constructing tx")
    const txAttrs = txAttrsCheapEthChains({ to: to, value: value })
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

  // test helpers: sendMin(), sendTXSelf()

  // send a very small amount (1/20 of the tx fee - total transaction cost will be ~0.22 USD cents (or ~0.000022 USD) - a very small amount)
  async sendMin({ to, value }) {
    const txHash = await this.send({ to: to, value: 1000000000000 })
    console.log("TX:", txHash)
    return true
  }

  // send the minimum amount to your address
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


if (typeof window === 'object') { // browserify export
  window.Keychain = Keychain
}
