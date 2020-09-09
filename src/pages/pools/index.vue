<template>
  <div class="boxConntent1 container pt-50" v-loading="loading.init" element-loading-text="Loading...">
    <div>
      <el-row :gutter="10">
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6" v-for="(item, index) in userInfo" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{item.label}}</span>
            </div>
            <p class="">{{item.value}}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="mt-30 box_Wshadow1 plr15 pt-20 pb-20">
      <el-form label-position="top" label-width="80px" :model="withdrawalForm">
        <el-form-item :label="$t('btn').withdrawal">
          <el-input v-model="withdrawalForm.val"></el-input>
          <p class="font12 cursorP line-block" @click="withdrawalForm.val = $$.BNToStr(unissuedReward)">
            最大提现：
            <span>
              {{$$.BNToStr(unissuedReward)}} FSN
            </span>
          </p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="withdrawalFn">{{$t('btn').withdrawal}}</el-button>
          <span class="ml-10 color_99 font12">(提现手续费: {{$$.BNToStr('0x' + this.poolConfig.withdrawFee)}})</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-30 box_Wshadow1 plr15 pt-20 pb-20">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="Timelock" name="timelock">
          <el-table :data="timelock" style="width: 100%" :max-height="800" empty-text="Null">
            <el-table-column label="Start" align="left">
              <template slot-scope="scope">
                <span>{{$$.timeChange({date: scope.row.startTime, type: 'yyyy-mm-dd hh:mm:ss', format: '-'})}}</span>
              </template>
            </el-table-column>
            <el-table-column label="End" align="left">
              <template slot-scope="scope">
                <span>{{$$.timeChange({date: scope.row.endTime, type: 'yyyy-mm-dd hh:mm:ss', format: '-'})}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('label').balance" align="left">
              <template slot-scope="scope">
                <span>{{$$.BNToStr(scope.row.amount)}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('label').action" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="withdrawalTimelockFn(scope.row)">{{$t('btn').withdrawal}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 签名 start -->
    <el-dialog :title="$t('btn').unlock" :visible.sync="prop.pwd" width="300" :before-close="cancel" :close-on-click-modal="false" :modal-append-to-body='false'>
      <unlock v-if="prop.pwd" :txnsData='dataPage' @setPrviKey="getSignData"></unlock>
    </el-dialog>
    <!-- 签名 end -->

    <!-- 发送确认 start -->
    <el-dialog :title="$t('title').sendSure" :visible.sync="prop.confirm" width="300" :before-close="cancel" :close-on-click-modal="false" :modal-append-to-body='false'>
      <div class="confirm-box">
        <h3>{{$t('label').send}}</h3>
        <ul class="ul">
          <li class="item" v-if="whTip.from">
            <p>From:</p> <p>{{whTip.from}}</p>
          </li>
          <li class="item" v-if="whTip.value">
            <p>Value:</p> <p>{{whTip.value}}</p>
          </li>
          <li class="item" v-if="whTip.startTime">
            <p>Start:</p> <p>{{$$.timeChange({date: whTip.startTime, type: 'yyyy-mm-dd', format: '-'})}}</p>
          </li>
          <li class="item" v-if="whTip.endTime">
            <p>End:</p> <p>{{$$.timeChange({date: whTip.endTime, type: 'yyyy-mm-dd', format: '-'})}}</p>
          </li>
        </ul>
        <div class="mt-30">
          <el-button type="primary" @click="sendTxns" class="WW30 btn-yellow">{{$t('btn').send}}</el-button>
          <el-button @click="cancel" class="WW30 ml-20 btn-radius">{{$t('btn').cancel}}</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 发送确认 end -->
  </div>
</template>

<style lang="scss">
@import '@/pages/account/scss/send.scss';
</style>

<script>
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
const VS = new VueSocketIO({
  debug: false,
  connection: 'wss://pool.gofsn.com',
})
Vue.use(VS)
export default {
  name: 'pool',
  data () {
    return {
      activeName: 'timelock',
      totalReward: '',
      unissuedReward: '',
      timelock: [],
      transactions: [],
      userInfo: [],
      withdrawalForm: {
        val: ''
      },
      loading: {
        init: true
      },
      dataPage: {},
      prop: {
        pwd: false,
        confirm: false
      },
      signTx: '',
      whTip: {
        from: '',
        to: '',
        value: '',
        startTime: '',
        endTime: '',
      },
      poolConfig: ''
    }
  },
  sockets: {
    userInfo (res) {
      console.log(res)
      if (res.success) {
        this.userInfo = [
          {label: '总收益', value: this.$$.BNToStr(res.data.totalReward) + ' FSN'},
          {label: '未发放收益', value: this.$$.BNToStr(res.data.unissuedReward) + ' FSN'},
          {label: '时间锁笔数', value: res.data.timelock.length},
          {label: '交易笔数', value: res.data.transactions.length},
        ]
        this.totalReward = res.data.totalReward
        this.unissuedReward = res.data.unissuedReward
        this.timelock = res.data.timelock
        this.transactions = res.data.transactions
      }
      this.loading.init = false
    },
    config (res) {
      this.poolConfig = res
    },
    summary (res) {
      // console.log(res)
    },
  },
  computed: {
    address () {
      return this.$store.state.address
    },
    chainId () {
      return this.$store.state.chainID
    }
  },
  mounted () {
    // let withdrawData = {
    //   type: "withdraw",
    //   amount: this.userData.unissuedReward.toString(16)
    // }
    // let sendBackData = {
    //   type: "sendBack",
    //   startTime: startTime,
    //   endTime: endTime,
    //   amount: amount.toString(16)
    // }
    // let rawTx = {
    //   gasPrice: '1000000000',
    //   gas: '21000',
    //   to: '0x0101010101010101010101010101010101010101',
    //   from: account,
    //   value: '0x00',
    //   data: hex,
    //   chainId: 32659,
    // }

    // console.log(VS)
    this.$socket.emit("getConfig")
    // console.log(this.$$.web3.utils.hexToUtf8('0x7b2274797065223a227769746864726177222c22616d6f756e74223a223078313633343537383564386130303030227d'))
    this.getUserInfo()
    // VS.io.on("userInfo", (res) => {
    //   console.log(res)
    // })
    // VS.listener.subscribe('userInfo')
    // console.log(this)
    // this.use(vueSocketIo)
  },
  methods: {
    cancel () {
      // this.formData = {}
      this.prop.confirm = false
      this.prop.pwd = false
    },
    getUserInfo () {
      this.$socket.emit('getUserInfo', {address: this.address})
    },
    withdrawalFn () {
      let withdrawData = {
        type: "withdraw",
        amount: this.$$.web3.utils.toHex(this.$$.toWei(this.withdrawalForm.val, 'FSN'))
      }
      let input = this.$$.web3.utils.toHex(withdrawData)
      this.whTip = {
        from: this.address,
        value: this.withdrawalForm.val
      }
      this.toSign(input)
    },
    withdrawalTimelockFn (item) {
      let withdrawData = {
        type: "sendBack",
        startTime: item.startTime,
        endTime: item.endTime,
        amount: item.amount.toString(16)
      }
      this.whTip = {
        from: this.address,
        value: this.$$.BNToStr(item.amount),
        startTime: item.startTime,
        endTime: item.endTime,
      }
      let input = this.$$.web3.utils.toHex(withdrawData)
      this.toSign(input)
    },
    toSign (input) {
      let to = this.poolConfig.withdrawAddress
      let data = {
        chainId: this.chainId,
        from: this.address,
        gas: '',
        gasPrice: "",
        nonce: "",
        to: to,
        value: '0x' + this.poolConfig.withdrawFee,
        input: input
      }
      let count = 0, time = Date.now()
      let value = this.$$.toWei(this.withdrawalForm.val, 'FSN')

      console.log(data)
      const batch = new this.$$.web3.BatchRequest()
      // batch.add(this.$$.web3.eth.estimateGas.request({to: this.swapInfo.ContractAddress}, (err, res) => {
      batch.add(this.$$.web3.eth.estimateGas.request({to: to, data: input}, (err, res) => {
        if (err) {
          console.log(err)
          data.gas = this.$$.web3.utils.toHex(12600 * 100)
          count ++
        } else {
          data.gas = this.$$.web3.utils.toHex(res * 6)
          count ++
        }
      }))
      batch.add(this.$$.web3.eth.getTransactionCount.request(this.address, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(2)
          data.nonce = this.$$.web3.utils.toHex(res)
          count ++
        }
      }))
      batch.add(this.$$.web3.eth.getGasPrice.request((err, res) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(3)
          data.gasPrice = this.$$.web3.utils.toHex(res)
          count ++
        }
      }))
      batch.execute()
      // console.log(data)
      let getDataIntervel = setInterval(() => {
        if (count >= 3 && ( (Date.now() - time) <= 30000 )) {
          this.dataPage = data
          this.getInputData()
          clearInterval(getDataIntervel)
        } else if (count < 3 && ( (Date.now() - time) > 30000 )) {
          this.msgError('Error')
          this.loading.init = false
          clearInterval(getDataIntervel)
        }
      }, 1000)
    },
    
    getInputData () {
      try {
        console.log(this.dataPage)
        this.loading.init = false
        this.prop.pwd = true
      } catch (error) {
        console.log(error)
        this.msgError(error.toString())
        this.loading.init = false
      }
    },
    getSignData (data) {
      this.prop.pwd = false
      if (data.msg === 'Success') {
        this.signTx = data.info
        this.prop.confirm = true
      } else {
        this.msgError(data.error)
      }
    },
    sendTxns () {
      this.$$.web3.eth.sendSignedTransaction(this.signTx, (err, hash) => {
        this.cancel()
        if (err) {
          this.msgError(err.toString())
        } else {
          console.log(hash)
          this.msgSuccess(this.$t('success').s_4 + 'Hash:' + hash)
        }
        this.prop.confirm = false
        this.toUrl('/account')
      })
    },
    handleClick () {

    }
  }
}
</script>