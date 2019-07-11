// this is the default node host used for the library, so you don't have to configure it

// infura/cloudflare/your-own-node.example...

// const RPC_HOST = "34.246.186.79"
const RPC_HOST = "34.246.186.79" // /etc/hosts entry: "34.246.186.79 antani-node.dev"
// run your node with "parity --chain ~/poa-chain-spec/spec.json --reserved-peers ~/poa-chain-spec/bootnodes.txt --jsonrpc-interface all --jsonrpc-hosts all  --jsonrpc-cors=http://antani.dev:3000/"
const RPC_PORT = 3000
// replace antani.dev:3000 with your dev host

// use this if you're running your own node on the same machine (your "dev box"):

// const RPC_HOST = "localhost"

const CONFIGS = {
  RPC_HOST: RPC_HOST,
  RPC_PORT: RPC_PORT,
}

module.exports = CONFIGS
