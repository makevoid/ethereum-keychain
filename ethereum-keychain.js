// imports

// const lib = require('ehtereum-keychain-lib')
const { gasPriceDefault } = require('ehtereum-keychain-lib')
const bitcoin = require('bitcoinjs-lib') // we use btc keys and bip39 (btc keys are a subset of all possible ethereum keys)
const bip39   = require("bip39")
const wif     = require('wif')
// init web3
const Web3    = require("web3")
// const { inspect } = require('util')


// ----------------------------------------------------------------------------
// configs
// ----------------------------------------------------------------------------

// infura/cloudflare/your-own-node.example...

const RPC_HOST = "34.246.182.38"

// use this if you're running your own node on the same machine (your "dev box"):

// const RPC_HOST = "localhost"




// ----------------------------------------------------------------------------


// exception definition

class KeychainError extends Error { }

class PrivateKeyLoadError extends KeychainError {
  constructor() { super("PrivateKeyLoadError: Failed to load Private key") }
}

// main

const { Keychain } = require('ethereum-keychain-keychain')

module.exports = {
  Keychain: Keychain
}
