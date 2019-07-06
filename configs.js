// this is the default node host used for the library, so you don't have to configure it

// infura/cloudflare/your-own-node.example...

// const RPC_HOST = "34.246.186.79"
const RPC_HOST = "antani-node.dev" // /etc/hosts entry: "34.246.186.79 antani-node.dev"

// use this if you're running your own node on the same machine (your "dev box"):

// const RPC_HOST = "localhost"

const CONFIGS = {
  RPC_HOST: RPC_HOST,
}

module.exports = CONFIGS
