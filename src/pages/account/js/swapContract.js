import swapABI from '@/config/swapABI.js'
import swapETHABI from '@/config/swapETHABI.js'

export const swapTokenContract = {
  getSwapCoinInfo () {
    return [
      {coinType: 'mBTC', url: 'https://testnet.smpcwallet.com/btc2fsn'},
      {coinType: 'mETH', url: 'https://testnet.smpcwallet.com/eth2fsn'},
      {coinType: 'mUSDT', url: 'https://testnet.smpcwallet.com/usdt2fsn'},
    ]
  },
  getSwapContractAPI (url, coin) {
    let address = this.$store.state.address
    return new Promise(resolve => {
      this.$axios.post(url, {
        id:0,
        jsonrpc:"2.0",
        method:"swap.GetServerInfo",
        params:[]
      }).then(res => {
        let data = res.data.result
        let ABI = coin === 'mBTC' ? swapABI : swapETHABI
        let contract = new this.$$.web3.eth.Contract(ABI, data.DestToken.ContractAddress)
        contract.methods.balanceOf(address).call({from: address}, (err, res) => {
          let balance = 0
          if (!err) {
            balance = res
          }
          resolve({
            id: data.DestToken.ContractAddress,
            coinType: coin,
            balance: balance,
            swapInfo: data.DestToken,
            contract: contract
          })
        })
      }).catch(err => {
        console.log(err)
        resolve({
          id: '',
          coinType: coin,
          balance: 0,
          swapInfo: {},
          contract: {}
        })
      })
    })
  },
  getAllSwapContract () {
    let arr = [], coinList = this.getSwapCoinInfo()
    for (let obj of coinList) {
      arr.push(this.getSwapContractAPI(obj.url, obj.coinType))
    }
    return new Promise(resolve => {
      Promise.all(arr).then(res => {
        let coinObj = {}
        for (let i = 0, len = coinList.length; i < len; i++) {
          let obj = coinList[i]
          coinObj[obj.coinType] = res[i]
        }
        resolve(coinObj)
        // resolve(res)
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