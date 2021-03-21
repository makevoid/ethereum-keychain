# ethereum-keychain
### Ethereum wallet js lib

version for node, browser and cordova

### why another ethereum keychain lib

this is based on  `bip39` and `bitcoinjs-lib` libraries, this means that you can have a multi-wallet bitcoin and ethereum keychain/wallet

#### features

- small
- bitcoin + ethereum


### status

WIP


### Current configuration

default storage in node is file, default storage for browser is `localStorage`, default storage for mobile apps is the secure-storage cordova plugin (https://www.npmjs.com/package/cordova-plugin-secure-storage)


### Install NPM (from github)

    npm i --save git+https://github.com/makevoid/ethereum-keychain.git


### Run in node

Check the example in this repo `eth-keychain-example-node.js`, copy-paste it in your file (e.g. `main.js`), adjust the `require()` to `require('ethereum-keychain')` and run the sample code: 

```
node main.js
```

## Run in browser

To run in browser use a local server and point it `./browser-example/` (`./browser-example/index.html`)


---

enjoy,

@makevoid

