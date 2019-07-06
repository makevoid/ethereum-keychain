# notes:

### Code snippets

```js
// node logging
const { inspect } = require('util')
console.log("PrivateKey:", inspect(this.pvtKey).slice(0, 85))
```

### Other notes

(integration consideration - UX/user-admin - load first 100 in background then what?, if more than 30 found then let the user)

### notes about dai:

if you don't run a node then this is not your problem

if you run a node (possibly portable) you would want to run a light ethereum client as well


### notes about the project - current status

Currently cordova has not yet added, but it will soon :D

- add tests :D

### notes about the project - future

UI - nfc 2 phones transaction

- xdai
- BTC LN


### other notes:

- using bitcore-lib which has a nicer API, you don't have to pass from WIF, bitcoinjs-lib is not super nice
- consider switching to pure libsecp256k1 ?
