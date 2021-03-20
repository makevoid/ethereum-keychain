let defaultRPCHost = "https://main-light.eth.linkpool.io" // mainnet

if (process.env.CTH === "1") defaultRPCHost = "https://node.cheapeth.org/rpc"
if (process.env.XDAI === "1") defaultRPCHost = "https://xdai.poanetwork.dev"

defaultRPCHost = process.env.ETH_RPC_HOST || defaultRPCHost
const defaultRPCPort = process.env.ETH_RPC_PORT 

const RPC_HOST = defaultRPCHost
const RPC_PORT = defaultRPCPort

// for local dev node:
// const RPC_HOST = "localhost"

const CONFIGS = {
  RPC_HOST: RPC_HOST,
  RPC_PORT: RPC_PORT,
}

module.exports = CONFIGS
