/**
 * @description web3
 */
import web3 from '@/assets/js/web3/index.js'
import { ethers } from 'ethers'
const crypto = require("crypto")
export default {
  ksToAccount (ks, pwd) {
    return new Promise(resolve => {
      new ethers.Wallet.fromEncryptedJson( ks, pwd ).then(res => {
        console.log(res)
        resolve(res)
      })
    })
  },
  privToAccount (priv) {
    return new ethers.Wallet(priv.replace('0x', ''))
  },
  pubkeyToAddress (pubkey) {
    let address = crypto.PubkeyToAddress(pubkey)
    console.log(address)
  }
}