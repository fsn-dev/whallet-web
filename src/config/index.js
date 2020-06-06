export default {
  // serverURL: 'https://www.myfusionwallet.com',
  // serverURL: 'http://3.16.110.25:9001',
  // serverURL: '/api',
  serverURL: localStorage.getItem('network') ? localStorage.getItem('network') : 'https://fsn.dev/api',
  version: '0.1.0',
  appURL: 'https://whallet.net',
  swapRPC: 'http://47.92.168.85:13556/rpc'
  // serverURL: 'https://testnet.fsn.dev/api',
}