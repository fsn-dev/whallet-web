// const TESTNET = 'https://fsn.dev/api'
const TESTNET = 'https://testnet.anyswap.exchange'
// const MAINNET = 'https://fsn.dev/api'
const MAINNET = 'https://mainnet.anyswap.exchange'
const CHAINID_TEST = '46688'
const CHAINID_MAIN = '32659'
export default {
  // serverURL: 'https://www.myfusionwallet.com',
  // serverURL: 'http://3.16.110.25:9001',
  // serverURL: '/api',
  CHAINID_TEST,
  CHAINID_MAIN,
  TESTNET,
  MAINNET,
  serverURL: localStorage.getItem('chainID') === '46688' ? TESTNET : MAINNET,
  version: '0.1.0',
  appURL: 'https://whallet.net',
  swapRPC: 'https://testnet.smpcwallet.com/btc2fsn'
  // serverURL: 'https://testnet.fsn.dev/api',
}