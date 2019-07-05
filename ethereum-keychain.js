const bitcoin = require('bitcoinjs-lib')
const bip39 = require("bip39")
const Web3 = require("web3")
const wif = require('wif')
// const { inspect } = require('util')

const RPC_HOST = "34.246.182.38"
// const RPC_HOST = "localhost"

class KeychainError extends Error { }
class PrivateKeyLoadError extends KeychainError {
  constructor() { super("PrivateKeyLoadError: Failed to load Private key") }
}

const txAttrsXDai = ({ to, value }) => ({
  // gasPrice: 0, // for testnets
  gasPrice: "1000000000", // 1 gwei
  gas:      "21000",
  to:       to,
  value:    value,
})

const resolveTxHash = (txHashPromise) => (
  new Promise((resolve, reject) => {
    const txHashCallback = (txHash) => {
      console.log("txHash:", txHash)
      return resolve(txHash)
    }
    txHashPromise.on('transactionHash', txHashCallback)
  })
)

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

  loadWeb3Account() {
    console.log("TODO: load private key")
    // const privateKey = `${"0x"}${this.pvtKey.toString("hex")}`

    const privateKey = wif.decode(this.pvtKey.toWIF()).privateKey
    const privateKeyEth = `${"0x"}${privateKey.toString("hex")}`

    console.log("privateKey:", privateKey)
    console.log("privateKey (BTC - WIF):", this.pvtKey.toWIF())
    console.log("privateKeyEth:", privateKeyEth)
    const account = this.web3Accounts.privateKeyToAccount(privateKey)
    this.pvtKeyEth = account.privateKey
    // console.log("account:", inspect(account).slice(0, 85))
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
    // console.log("PrivateKey:", inspect(this.pvtKey).slice(0, 85))
    console.log("Address:",    this.address)
  }

  async netInfo() {
    const info = {}
    // info.chainId = await this.eth.getChainId()
    info.address = this.address
    info.balance = await this.eth.getBalance(this.address)
    info.balanceEth = this.web3.utils.fromWei(info.balance, "ether")
    info.balanceCents = Math.round(new Number(info.balanceEth) * 10000) / 100
    info.blockNum = await this.eth.getBlockNumber()
    const block   = await this.eth.getBlock(info.blockNum)
    info.blockHash = block.hash
    console.log("Info:", JSON.stringify(info, null, 2))
  }

  // init web3

  initWeb3() {
    const rpcHost = RPC_HOST
    const rpcPort = "8545" // default
    const web3 = new Web3(`http://${rpcHost}:${rpcPort}`)
    return web3
  }

  async send({ to, value }) {
    console.log("constructing tx")
    const txAttrs = txAttrsXDai({ to: this.address, value: 1000000000000 })
    const rawTx = await this.signTx(txAttrs, this.pvtKeyEth)
    // console.log("rawTx:", rawTx)

    // naive wallet (I like it as it makes sense on a proof of authority public network where the scale is infinite)

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

  // TODO: move to test helpers

  async selfTXTest() {
    const txHash = await this.send({ to: this.address, value: 1000000000000 })
    console.log("TX:", txHash)
    return true
  }
}

module.exports = {
  Keychain: Keychain
}
