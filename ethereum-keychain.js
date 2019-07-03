class KeychainError extends Error { }
class PrivateKeyLoadError extends KeychainError {
  constructor() { super("PrivateKeyLoadError: Failed to load Private key") }
}

class Keychain {
  constructor({ store }) {
    if (!store) console.warn("Using localstorage")
    this.Store = { store }

    if (this.boom) throw new KeychainError
    this.loadOrGeneratePrivateKey()
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
      this.setInstanceVariables()
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
    return bitcoin.ECPair.fromWIF(this.storedKey())
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



}

module.exports = {
  Keychain: Keychain

}
