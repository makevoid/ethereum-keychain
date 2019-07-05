const bitcoin = require('bitcoinjs-lib')
const bip39 = require("bip39")
const Web3 = require("web3")
const wif = require('wif')
// TODO: remove without node
const { inspect } = require('util')

class KeychainError extends Error { }
class PrivateKeyLoadError extends KeychainError {
  constructor() { super("PrivateKeyLoadError: Failed to load Private key") }
}

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
    this.pvtKeyEthStr = `0x${account.privateKey.toString("hex")}`
    // this.pvtKeyEthStr = account.privateKey.toString("hex")
    // // TODO: remove throwaway account
    // const accountThrowaway = this.web3Accounts.create()
    // console.log("account (throwaway):", inspect(accountThrowaway).slice(0, 85))
    console.log("account:", inspect(account).slice(0, 85))
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
    console.log("PrivateKey:", inspect(this.pvtKey).slice(0, 85))
    console.log("Address:",    this.address)
  }

  async netInfo() {
    const info = {}
    // info.chainId = await this.eth.getChainId()
    info.address = this.address
    info.balance = await this.eth.getBalance(this.address)
    info.balanceEth = this.web3.utils.fromWei(info.balance, "ether")
    info.blockNum = await this.eth.getBlockNumber()
    const block   = await this.eth.getBlock(info.blockNum)
    info.blockHash = block.hash
    console.log("Info:", JSON.stringify(info, null, 2))
  }

  // init web3

  initWeb3() {
    const rpcHost = "34.246.182.38"
    const rpcPort = "8545" // default
    const web3 = new Web3(`http://${rpcHost}:${rpcPort}`)
    return web3
  }

  async selfTXTest() {
    const signTx = (txAttrs, privateKey) => {
      return new Promise((resolve, reject) => {
        const txCallback = (err, signedTx) => {
          console.log("signedTx:", signedTx)
          if (err) return reject(err)
          if (!signedTx.rawTransaction) return reject(new Error("NoRawTransactionError"))
          resolve(signedTx.rawTransaction)
        }
        this.web3Accounts.signTransaction(txAttrs, privateKey, txCallback)
      })
    }

    const txAttrs = {
      to:   this.address,
      gasPrice: "1000000000", // 1 gwei
      // gasPrice: 100000000, // 0.1 gwei
      gas: "21000",
      // 1000000000000000000 // 1 eth    ( 1 xdai,    ~ 1$ )
      value: 1000000000000,   // 0.01 eth ( 0.01 xdai, ~ 1 cent )
      // value: 10000000000000000,   // 0.01 eth ( 0.01 xdai, ~ 1 cent )
    }
    console.log("constructing tx")
    console.log(this.pvtKeyEthStr)
    const rawTx = await signTx(txAttrs, this.pvtKeyEth)
    console.log("rawTx:", rawTx)
    console.log("submitting tx...")
    const callback = (error, txReceipt) => {
      console.log("txReceipt:", txReceipt)
    }
    const txHashPromise = this.eth.sendSignedTransaction(rawTx)

    return new Promise((resolve, reject) => {
      const txHashCallback = (txHash) => {
        console.log("txHash:", txHash)
        return resolve(txHash)
      }
      txHashPromise.on('transactionHash', txHashCallback)
      // const receiptCallback = (txReceipt) => {
      //   console.log("txReceipt:", txReceipt)
      // }
      // txReceiptPromise.on('receipt', receiptCallback)

    })
  }
}

module.exports = {
  Keychain: Keychain

}

//

// new Keychain


const { readFileSync } = require('fs')
const pvtKey = readFileSync('./.private-key.txt').toString().trim()
const wallet = new Keychain({ store: { "__ethereum-keychain_": pvtKey } })
// const wallet = new Keychain({ store: { "__ethereum-keychain_": "xxx4ce654ba0eab4e1f93ddd9cc680ce9351fbae3030587c49db36191ac663cc6a9" } })
// const wallet = new Keychain({ store: {} })
wallet.info()

;(async () => {
  try {
    await wallet.netInfo()

    const txHash = await wallet.selfTXTest()
    console.log("TX:", txHash)
  } catch (err) {
    console.log("Caught async error")
    console.error(err)
    console.error(err.stack)
  }
})()
// new Keychain({ store: localStorage }) // browser
