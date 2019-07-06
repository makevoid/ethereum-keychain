const { gasPrice } = "./ethereum-keychain-env"

const txAttrsXDai = ({ to, value }) => ({
  // gasPrice: 0, // for testnets
  gasPrice: gasPrice() || "1000000000", // 1 gwei
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
  txAttrsXDai:   txAttrsXDai,
  resolveTxHash: resolveTxHash,
}
