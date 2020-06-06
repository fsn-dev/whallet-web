import swapABI from '@/config/swapABI.js'

export const swapTokenContract = {
  getSwapContract (url) {
    return new Promise(resolve => {
      const ContractAddress = "0xbd8d4dcdc017ea031a46754b0b74b2de0cd5eb74"
      resolve({
        swapInfo: {
          BlockChain: "Fusion",
          Confirmations: 0,
          ContractAddress: ContractAddress,
          DcrmAddress: "0x4B4c806c949B2375a58275178DEf06560b79351A",
          Decimals: 8,
          Description: "cross chain bridge BTC with mBTC",
          MaximumSwap: 100,
          MinimumSwap: 0.00001,
          Name: "SMPC Bitcoin",
          NetID: "Testnet",
          SwapFeeRate: 0.001,
          Symbol: "mBTC"
        },
        contract: new this.$$.web3.eth.Contract(swapABI, ContractAddress)
      })
      // this.$axios.post(url, {
      //   id:0,
      //   jsonrpc:"2.0",
      //   method:"swap.GetServerInfo",
      //   params:[]
      // }).then(res => {
      //   console.log(res)
      //   // let data = res.data.result
      //   // resolve({
      //   //   swapInfo: data.DestToken,
      //   //   contract: new this.$$.web3.eth.Contract(swapABI, data.DestToken.ContractAddress)
      //   // })
      // })
    })
  }
}