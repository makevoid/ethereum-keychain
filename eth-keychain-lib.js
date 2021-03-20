const { gasPriceDefault } = require("./eth-keychain-env")

// tx attrs with 21k gas and 1 gwei gasprice (good for xdai, cheapeth, etc...)
const txAttrsCheapEthChains = ({ to, value }) => ({
  // gasPrice: 0, // for testnets
  gasPrice: gasPriceDefault() || "1000000000", // 1 gwei
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

module.exports = {
  txAttrsCheapEthChains:  txAttrsCheapEthChains,
  resolveTxHash:          resolveTxHash,
}
