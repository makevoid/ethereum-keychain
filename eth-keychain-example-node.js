// this example uses the cheapeth / cTH network
process.env.CTH = "1"

// initialize the library
const { Keychain } = require('./ethereum-keychain')
// use this line instead if you have the library installed:
// const { Keychain } = require('ethereum-keychain')

// load private key file
const { readFileSync } = require('fs')
const pvtKey = readFileSync('./.private-key.txt').toString().trim()
if (!pvtKey) {
  console.error("private key is empty - generate, backup and load a private key first")
  process.exit(1)
}

// initialize keychain
wallet = new Keychain({ store: { "__ethereum-keychain_": pvtKey } })

// prints local info (wallet address)
wallet.info()

;(async () => {

  // prints info fetched from the node
  await wallet.netInfo()

  // sample tx to self
  console.log("sending transaction to self")
  await wallet.sendTXSelf()

  // full tx example:
  // const address = wallet.address // your address
  // const value = 1000000000000 // value in wei - minimal value that you can send (0.000001 cETH)
  // // send transaction
  // const txHash = await wallet.send({ to: address, value })
  // console.log("TX:", txHash)

  // prints info after transaction
  await wallet.netInfo()

  process.exit()
})()
