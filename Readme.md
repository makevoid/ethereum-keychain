# ethereum-keychain
### Ethereum wallet js lib

version for node, browser and cordova

### why another ethereum keychain lib

this is `bip39` and `bitcoinjs-lib` based for the keychain bit

it's very small (implementation-wise)

for the full functionality I have to implement next:
- proper tx code (almost done)
- hd wallet generation
- wallet balances loading

note that it's still WIP (but very promising)

### Suggestion

run your own node:

- xdai

and of course you should check out my other repo (bitcoin-ln-keychain) and get a portable lnd + bitcoind node


### Current configuration

default storage in node is file, default storage for browser is `localStorage`, default storage for mobile apps is the secure-storage cordova plugin (https://www.npmjs.com/package/cordova-plugin-secure-storage)

(it's short anyway, start from `ethereum-keychain.js`, then check out lib and obviously config if you want to run it)


### Run in node

To run the example (that calls `info()` and `sendTXSelf()`) you can use node and run:

```
node eth-keychain-example-node.js
```

## Run in browser

To run in browser use a local server and point it `./browser-example/` (`./browser-example/index.html`)


---

Currently cordova has not yet added, but it will soon :D
