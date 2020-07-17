import swapABI from '@/config/ABI/swapABI.js'
import swapETHABI from '@/config/ABI/swapETHABI.js'
import tokens from '@/config/tokens.js'

export const swapTokenContract = {
  getSwapCoinInfo () {
    return [
      {coinType: 'mBTC', url: 'https://testnet.smpcwallet.com/btc2fsn'},
      {coinType: 'mETH', url: 'https://testnet.smpcwallet.com/eth2fsn'},
      {coinType: 'mUSDT', url: 'https://testnet.smpcwallet.com/usdt2fsn'},
    ]
  },
  getSwapContractAPI (ContractAddress, swapInfo) {
    let address = this.$store.state.address
    return new Promise(resolve => {
      if (swapInfo.ISSWITCH) {
        let ABI = swapInfo.SYMBOL === 'mBTC' ? swapABI : swapETHABI
        let contract = new this.$$.web3.eth.Contract(ABI, ContractAddress)
        contract.methods.balanceOf(address).call({from: address}, (err, res) => {
          let balance = 0
          if (!err) {
            balance = res
          }
          console.log(res)
          resolve({
            ...swapInfo,
            id: ContractAddress,
            coinType: swapInfo.SYMBOL,
            balance: balance,
            contract: contract
          })
        })
      } else {
        resolve({
          ...swapInfo,
          id: '',
          coinType: swapInfo.SYMBOL,
          balance: '-',
          contract: ''
        })
      }
    })
  },
  getAllSwapContract () {
    let chainID = this.$store.state.chainID
    let arr = [], coinList = tokens[chainID]
    for (let obj in coinList) {
      arr.push(this.getSwapContractAPI(obj, coinList[obj]))
    }
    return new Promise(resolve => {
      Promise.all(arr).then(res => {
        let coinObj = {}
        for (let i = 0, len = res.length; i < len; i++) {
          let obj = res[i]
          coinObj[obj.coinType] = res[i]
        }
        resolve(coinObj)
        resolve(res)
      })
    })
  },
  getSwapInfo () {
    return new Promise(resolve => {
      if (this.$store.state.swapCoin.length > 0) {
        resolve(this.$store.state.swapCoin)
      } else {
        this.getAllSwapContract().then(res  => {
          this.$store.commit('setSwapCoin', res)
          resolve(res)
        })
      }
    })
  },
  registerAddress (url, address) {
    return new Promise(resolve => {
      this.$axios.post(url, {
        id:0,
        jsonrpc:"2.0",
        method:"swap.RegisterP2shAddress",
        params:[address]
      }).then(res => {
        // console.log(res)
        resolve(res.data)
      }).catch(err => {
        console.log(err)
        resolve(err)
      })
    })
  },
  getBTCTxnsAPI (url) {
    return new Promise(resolve => {
      this.$axios.get(url).then(res => {
        // console.log(res)
        resolve(res.data)
      }).catch(err => {
        console.log(err)
        resolve(err)
      })
    })
  },
  getTxnStatusAPI (url, hash) {
    return new Promise(resolve => {
      this.$axios.post(url, {
        id:0,
        jsonrpc:"2.0",
        method:"swap.GetSwapin",
        params:[hash]
      }).then(res => {
        // console.log(res)
        resolve(res.data)
      }).catch(err => {
        console.log(err)
        resolve(err)
      })
    })
  }
}