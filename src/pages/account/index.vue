<template>
  <div class="boxConntent1 container pt-50 pb-50 flex-bc" v-loading="loading.init" element-loading-text="Loading...">
    <div class="account-info-box">
      <div class="account-header-img"><img :src="headerImg"></div>
      <ul class="account-info-cont">
        <li class="item">
          <h6 class="h6">FUSION BALANCE</h6>
          <p class="p"><span class="font18 mr-10">≈ {{$$.thousandBit(fsnBalance, 8)}}</span>FSN</p>
        </li>
        <li class="item">
          <h6 class="h6">mBTC BALANCE</h6>
          <p class="p"><span class="font18 mr-10">≈ {{$$.thousandBit(
            $$.fromWei(mBTCBalance, 8)
          , 8)}}</span>mBTC</p>
        </li>
        <li class="item">
          <h6 class="h6">PUBLIC ADDRESS</h6>
          <p class="p cursorP" @click="copyTxt($store.state.address)">{{$store.state.address}}</p>
        </li>
        <li class="item">
          <h6 class="h6">SHORT ADDRESS</h6>
          <p class="p">{{addrNode ? addrNode : $t('tip').addNode}}</p>
          <p class="p mt-10" v-if="!addrNode">FEE 0.1 FSN</p>
        </li>
        <li class="item flex-sc flex-wrap">
          <el-button type="primary" class="mt-10 mr-5" size="mini" v-if="!addrNode" @click="createAddrNode">{{$t('btn').GenerateSAN}}</el-button>
          <el-button type="primary" class="mt-10 mr-5 ml-0" size="mini" @click="openQRcode">{{$t('btn').viewQRcode}}</el-button>
          <el-button class="mt-10 mr-5 ml-0" size="mini" @click="exitWallet">{{$t('btn').exit}}</el-button>
        </li>
      </ul>
    </div>

    <div class="account-data-box">
      <div class="account-data-bg">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="Assets" name="assets">
            <el-table :data="balanceData" style="width: 100%" :max-height="800" empty-text="Null" v-if="refresh.table">
              <el-table-column :label="$t('label').coin" align="left">
                <template slot-scope="scope">
                  <div class="flex-sc" v-if="scope.row.SYMBOL && scope.row.SYMBOL === 'ANY'">
                    <div class="coin-logo">
                      <img :src="getCoinInfo(scope.row.SYMBOL).logo" v-if="getCoinInfo(scope.row.SYMBOL)">
                      <i class="null flex-c" v-else>{{scope.row.SYMBOL ? scope.row.SYMBOL.substr(0,1) : '0x'}}</i>
                    </div>
                    <span :title="scope.row.SYMBOL">{{scope.row.SYMBOL}}</span>
                  </div>
                  <div class="flex-sc" v-else>
                    <div class="coin-logo">
                      <img :src="getCoinInfo(scope.row.Symbol).logo" v-if="getCoinInfo(scope.row.Symbol)">
                      <i class="null flex-c" v-else>{{scope.row.Symbol ? scope.row.Symbol.substr(0,1) : '0x'}}</i>
                    </div>
                    <span :title="scope.row.Symbol">{{scope.row.Symbol}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  {{$$.cutOut(scope.row.id, 8, 6)}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('label').balance" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.SYMBOL && scope.row.SYMBOL === 'ANY'">
                    {{$$.thousandBit($$.fromWei(scope.row.balance, scope.row.DECIMALS), 'no')}}
                  </span>
                  <span v-else>
                    {{$$.thousandBit($$.fromWei(scope.row.balance, scope.row.Decimals), 'no')}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('label').action" align="right">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    v-if="scope.row.SYMBOL && scope.row.SYMBOL === 'ANY'"
                    :disabled="!Number(scope.row.balance) || !scope.row.ISSWITCH"
                    @click="toUrl('/swapSend', {id: scope.row.id, balance: scope.row.balance, type: '2', sendType: '1', coinType: scope.row.coinType, dec: scope.row.DECIMALS})"
                  >{{$t('btn').send}}</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    v-else
                    @click="toUrl('/send', {id: scope.row.id, balance: scope.row.balance, type: '0', dec: scope.row.Decimals, coinType: scope.row.Symbol})"
                  >{{$t('btn').send}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="Time-Locked Assets" name="timelock" v-if="refresh.table">
            <div v-for="(items, indexs) in timelockData" :key="indexs" class="mb-30">
              <el-table :data="items.list" style="width: 100%" :max-height="timelockData.length > 1 ? 300 : 800" size="mini" empty-text="Null">
                <el-table-column :label="$t('label').coin" align="left">
                  <template>
                    <div class="flex-sc">
                      <div class="coin-logo">
                        <img :src="getCoinInfo(items.Symbol).logo" v-if="getCoinInfo(items.Symbol)">
                        <i class="null flex-c" v-else>{{items.Symbol ? items.Symbol.substr(0,1) : '0x'}}</i>
                      </div>
                      <span :title="items.Symbol">{{items.Symbol}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Start" align="center">
                  <template slot-scope="scope">
                    {{
                      scope.row.StartTime.toString().length > 13 ?
                        'Forever'
                        : (
                          Date.parse('2019-06-30') > (Number(scope.row.StartTime) * 1000) ? 
                            'Now'
                            :
                            $$.timeChange({date: scope.row.StartTime, type: 'yyyy-mm-dd', format: '-'})
                        )
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="End" align="center">
                  <template slot-scope="scope">
                    {{
                      scope.row.EndTime.toString().length > 13 ? 'Forever' : $$.timeChange({date: scope.row.EndTime, type: 'yyyy-mm-dd', format: '-'})
                    }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('label').balance" align="center">
                  <template slot-scope="scope">
                    {{$$.fromWei(scope.row.Value, items.Decimals)}}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('label').action" align="right">
                  <template slot-scope="scope">
                    <!-- {{scope.row}} -->
                    <el-button type="primary" size="mini" @click="toUrl('/send', {id: items.id, balance: scope.row.Value, StartTime: scope.row.StartTime, EndTime: scope.row.EndTime, type: '1', dec: items.Decimals, coinType: items.Symbol})">{{$t('btn').send}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Cross Chain" name="ceosschain">
            <el-table :data="swapTable" style="width: 100%" :max-height="800" empty-text="Null">
              <el-table-column :label="$t('label').coin" align="left">
                <template slot-scope="scope">
                  <div class="flex-sc">
                    <div class="coin-logo">
                      <img :src="getCoinInfo(scope.row.coinType.replace('m', '')).logo" v-if="getCoinInfo(scope.row.coinType.replace('m', ''))">
                      <i class="null flex-c" v-else>{{scope.row.coinType ? scope.row.coinType.replace('m', '').substr(0,1) : '0x'}}</i>
                    </div>
                    <span>{{scope.row.coinType}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.ISSWITCH">{{$$.cutOut(scope.row.id, 8, 6)}}</span>
                  <span v-else class="flex-c font12 color_99">
                    <i class="el-icon-timer"></i>
                    {{$t('state').comingSoon}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('label').balance" align="center">
                <template slot-scope="scope">
                  {{
                    scope.row.ISSWITCH && scope.row.balance !== '-' ? 
                    $$.thousandBit(
                      $$.fromWei(
                        scope.row.balance,
                        scope.row.DECIMALS),
                      'no'
                    )
                    : '-'}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('label').action" align="center" width="240">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" :disabled="!scope.row.ISSWITCH || !scope.row.ISDEPOSIT" @click="openDepositView(scope.row)">{{$t('btn').deposit}}</el-button>
                  <el-button type="primary" size="mini" :disabled="!Number(scope.row.balance) || !scope.row.ISSWITCH || !scope.row.ISREDEEM" @click="toUrl('/swapSend', {id: scope.row.id, balance: scope.row.balance, type: '2', sendType: '0', coinType: scope.row.coinType, dec: scope.row.DECIMALS})">{{$t('btn').withdrawal}}</el-button>
                  <el-button type="primary" size="mini" :disabled="!Number(scope.row.balance) || !scope.row.ISSWITCH" @click="toUrl('/swapSend', {id: scope.row.id, balance: scope.row.balance, type: '2', sendType: '1', coinType: scope.row.coinType, dec: scope.row.DECIMALS})">{{$t('btn').send}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 签名 start -->
    <el-dialog :title="$t('btn').unlock" :visible.sync="prop.pwd" :before-close="cancel" :close-on-click-modal="false" :modal-append-to-body='false'>
      <unlock v-if="prop.pwd" :txnsData='dataPage' @setPrviKey="getSignData"></unlock>
    </el-dialog>
    <!-- 签名 end -->

    <!-- 地址二维码 start -->
    <el-dialog :title="$t('btn').unlock" :visible.sync="prop.qrCode" width="300px" :before-close="cancel" :close-on-click-modal="true" :modal-append-to-body='false'>
      <div class="flex-c">
        <div id="addressQRcode"></div>
      </div>
      <h6 class="font14 mt-20 color_gray">PUBLIC ADDRESS：</h6>
      <p class="cursorP" @click="copyTxt($store.state.address)">{{$store.state.address}}<span class="font12 ml-10" style="color:#0099ff;">(Click copy)</span></p>
    </el-dialog>
    <!-- 地址二维码 end -->
    
    <!-- 充值 start -->
    <el-dialog :title="$t('btn').deposit" :visible.sync="prop.deposit" width="400px" :before-close="cancel" :close-on-click-modal="true" :modal-append-to-body='false'>
      <div>
        <el-form>
          <el-form-item>
            <div class="flex-sc WW100">
              <el-input type="number" v-model="depositVal" :placeholder="'0.00' + (depositObj.coinType ? depositObj.coinType.replace('m', '') : '')"></el-input>
              <span v-if="depositVal" class="ml-10 W50 center">{{depositObj.coinType ? depositObj.coinType.replace('m', '') : ''}}</span>
            </div>
          </el-form-item>
          <el-form-item>
            <ul class="deposit-box">
              <li class="item flex-sc">
                <span class="label">Destination</span>
                <div class="value flex-sc">
                  <div class="icon"><img src="@/assets/img/wallet-icon.svg"></div>
                  <span>{{$$.cutOut(address, 5, 5)}}</span>
                </div>
              </li>
              <li class="item flex-sc">
                <span class="label">You will receive</span>
                <div class="value flex-sc">
                  <!-- <div class="icon"><img src="@/assets/img/coin/mBTC.svg"></div> -->
                  <div class="icon flex-c"><i class="el-icon-d-arrow-right"></i></div>
                  <span>
                    {{depositVal && depositObj.coinType? 
                    Number( (Number(depositVal) * ( 1 - Number(depositObj.FEE) ) ).toFixed(9))
                    : 
                    '0.00000000'}} {{depositObj.coinType}}
                  </span>
                </div>
              </li>
            </ul>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" class="WW100" @click="depositView">{{$t('btn').deposit}}</el-button>
      </div>
    </el-dialog>
    <!-- 充值 end -->

    <!-- 充值 view start -->
    <el-dialog :title="$t('btn').deposit" :visible.sync="prop.depositInfo" width="400px" :before-close="cancel" :close-on-click-modal="true" :modal-append-to-body='false'>
      <div>
        <div class="flex-c font22 mb-20">
          {{$t('btn').deposit}} 
          {{depositVal ? depositVal : $$.fromWei(btc.mintValue, depositObj.DECIMALS)}} {{depositObj.coinType ? depositObj.coinType.replace('m', '') : ''}}</div>
        <div class="flex-c">
          <div id="BTCaddressQRcode"></div>
        </div>
        <h6 class="font14 mt-20 color_gray">{{depositObj.coinType}} ADDRESS：</h6>
        <p class="cursorP" @click="copyTxt(depositObj.address)">{{depositObj.address}}<span class="font12 ml-10" style="color:#0099ff;">(Click copy)</span></p>
        <p class="color_red mt-15" v-if="depositObj.coinType !== 'mBTC'">{{$t('tip').bridgeMintTip.replace('\{\{account\}\}', address)}}</p>
      </div>
    </el-dialog>
    <!-- 充值 view end -->

    <!-- 充值信息 start -->
    <el-dialog :title="$t('btn').deposit" :visible.sync="prop.depositData" width="580px" :before-close="cancel" :close-on-click-modal="true" :modal-append-to-body='false'>
      <div>
        <ul class="deposit-box">
          <li class="item flex-sc">
            <span class="label WW30">Hash:</span>
            <div class="value flex-sc WW70">
              <span>{{btc.mintHash}}</span>
            </div>
          </li>
          <li class="item flex-sc">
            <span class="label WW30">From:</span>
            <div class="value flex-sc WW70">
              <span>{{btc.from}}</span>
            </div>
          </li>
          <li class="item flex-sc">
            <span class="label WW30">To:</span>
            <div class="value flex-sc WW70">
              <span>{{btc.address}}</span>
            </div>
          </li>
          <li class="item flex-sc">
            <span class="label WW30">Value:</span>
            <div class="value flex-sc WW70">
              <span> {{$$.fromWei(btc.mintValue, 8)}} BTC </span>
            </div>
          </li>
          <li class="item flex-sc">
            <span class="label WW30">Fee:</span>
            <div class="value flex-sc WW70">
              <span> {{
                $store.state.swapCoin['mBTC'] ? 
                $$.fromWei(Number(btc.mintValue) * Number($store.state.swapCoin['mBTC'].fee), 8)
                : ''
                }} BTC </span>
            </div>
          </li>
          <li class="item flex-sc">
            <span class="label WW30">Receive:</span>
            <div class="value flex-sc WW70">
              <span> {{
                $store.state.swapCoin['mBTC'] ? 
                $$.fromWei(Number(btc.mintValue) * (1 - Number($store.state.swapCoin['mBTC'].fee), 8))
                : ''
                }} mBTC </span>
            </div>
          </li>
          <li class="item flex-sc">
            <span class="label WW30">Receive FSN Address:</span>
            <div class="value flex-sc WW70">
              <span> {{address}} </span>
            </div>
          </li>
          <!-- <li class="item flex-sc">
            <span class="label WW30">Status:</span>
            <div class="value flex-sc WW70">
              <span class="color_green"> {{setHistoryState(btc.status).status}} </span>
            </div>
          </li> -->
        </ul>
      </div>
    </el-dialog>
    <!-- 充值信息 end -->

    <div class="deposit-tip-box box_Wshadow1 cursorP" v-if="btc.mintTip" @click="openMintView">
      <div class="flex-sc">
        <div class="logo flex-c"><img src="@/assets/img/coin/btc-blue.svg"></div>
        <span class="font14 color_99 txt flex-sc">Waiting for deposit</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.deposit-tip-box {
  $depositH: 60;
  $colorBg: #242FED;
  position: absolute; top:size(30);right: size(10); border-radius: size(4);box-shadow:0 0 5px 0px $colorBg ;
  .logo {
    width: size($depositH);height: size($depositH - 10);padding: size(8);//border-right: 1px solid $colorBg;//background:$colorBg;
    img {
      height: 100%;
    }
  }
  .icon {
    width: size(40);height: size(40);
  }
  .txt {
    width: 0;height: size($depositH - 10);white-space: nowrap;overflow: hidden;transition: width 0.5s;
  }
  &:hover {
    .txt {
      width: size(200);padding: 0 size(20);
    }
  }
}
.account-info-box {
  width: 30%; height: 100%;background: #f8f8f8;padding: size(15) size(30);overflow: auto;
  .account-header-img {
    width:size(64);height:size(64);margin: size(10) auto size(20);
    img {
      width: 100%;
    }
  }
  .account-info-cont {
    width: 100%;
    .item {
      font-size: size(14);color: #607d8b;margin-bottom: size(15);
      .p {
        padding: size(5);background: #e4e9f0;word-break: break-all;
      }
    }
  }
}
.account-data-box {
  width: 70%; height: 100%;padding-left:size(30);
  .account-data-bg {
    width: 100%;height: 100%;overflow: auto;
  }
}
.account-table {
  width: 100%;
  .title {
    font-size: size(20);color: #666666;
  }
}
.coin-logo {
  width: 25px; height: 25px;margin-right: 10px;
  img {
    width: 100%;
  }
  .null {
    width: 100%;height: 100%;border:1px solid #e8be29;border-radius: 100%;font-size: 12px;color: #e8be29;
  }
}
.deposit-box {
  width: 100%; border: 1px solid #ddd;
  .item {
    border-bottom: 1px  solid #ddd;padding: size(5) size(8);font-size: size(14);
    &:last-child {
      border-bottom: none;
    }
    .label {
      width: 45%;
    }
    .value {
      width: 55%;
      .icon {
        width: size(20);height: size(20);margin-right: size(5);
        img {
          height: 100%;display: block;
        }
      }
    }
  }
}
</style>

<script>
import coinInfo from '@/config/coininfo.js'
import {swapTokenContract} from './js/swapContract'
import tokens from '@/config/tokens.js'
export default {
  name: 'account',
  data () {
    return {
      activeName: 'assets',
      headerImg: '',
      fsnBalance: '',
      mBTCBalance: 0,
      balanceData: [],
      timelockData: [],
      addrNode: '',
      loading: {
        init: true
      },
      dataPage: {},
      prop: {
        pwd: false,
        qrCode: false,
        deposit: false,
        depositInfo: false,
        depositData: false
      },
      fsnId: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      TokenContract: '',
      swapInfo: {},
      swapTable: [],
      assetsID: {
        id: new Set(),
        list: {}
      },
      refresh: {
        table: true
      },
      btc: {
        address: '',
        setTimeout: '',
        mintValue: 0,
        mintTip: false,
        mintHash: '',
        status: '',
        from: ''
      },
      depositObj: {
        value: 0
      },
      depositVal: ''
    }
  },
  computed: {
    address () {
      return this.$store.state.address
    },
    chainId () {
      return this.$store.state.chainID
    },
    swapCoin () {
      return this.$store.state.swapCoin
    }
  },
  mounted () {
    this.activeName = this.$route.query.activeTab ? this.$route.query.activeTab : 'assets'
    this.init()
    this.getAllSwapContract()
    // this.$$.web3.eth.subscribe('pendingTransactions', (err, res) => {
    //   console.log(err)
    //   console.log(res)
    // })
    // console.log(this.$$.web3)
  },
  methods: {
    ...swapTokenContract,
    cancel () {
      this.prop.pwd = false
      this.prop.qrCode = false
      this.prop.deposit = false
      this.prop.depositInfo = false
      this.prop.depositData = false
      this.depositVal = ''
    },
    depositView () {
      if (!this.depositVal || Number(this.depositVal) === 0) {
        this.msgWarning(this.$t('warn').w_3)
        return
      }
      if (Number(this.depositObj.MINNUM) > Number(this.depositVal)) {
        this.msgError('Min value is:' + this.depositObj.MINNUM)
        return
      }
      if (Number(this.depositObj.MAXNUM) < Number(this.depositVal)) {
        this.msgError('Max value is:' + this.depositObj.MAXNUM)
        return
      }
      if (this.depositObj.coinType === 'ANY') {
        this.depositObj.address = address
      } else if (this.depositObj.coinType === 'mBTC') {
        this.depositObj.address = this.btc.address
      } else if (this.depositObj.DEPOSIT_ADDRESS) {
        this.depositObj.address = this.depositObj.DEPOSIT_ADDRESS
      } else {
        this.depositObj.address = ''
      }
      this.prop.deposit = false
      this.prop.depositInfo = true
      // this.depositObj.address = this.depositObj.coinType === 'mBTC' ? this.btc.address : this.depositObj.id
      this.$nextTick(() => {
        this.$$.qrCode(this.depositObj.address, 'BTCaddressQRcode')
      })
    },
    handleClick () {
      this.$router.push({path: this.$route.path, query: {activeTab: this.activeName}})
    },
    exitWallet () {
      this.$store.commit("setAddress", '')
      this.$store.commit("setKeystore", '')
      this.toUrl('/')
      // history.go(0)
    },
    init () {
      this.getHeader()
      this.initData()
      this.getBTCAddress()
      // console.log(this.$$.web3)
      // this.$$.web3.fsn.getAsset('0x2e80c6acd224d760a555d27c4538070179827b3d1fcc00436dfee0bc50789683', 'latest').then(res => {
      //   console.log(res)
      // })
    },
    getHeader () {
      this.headerImg = this.$$.createImg(this.$store.state.address)
    },
    initData () {
      if (!this.$store.state.address) return
      let arr = [
        {p1: 'fsn', p2: 'getAllBalances', p3: [this.$store.state.address, 'latest']},
        {p1: 'fsn', p2: 'getAllTimeLockBalances', p3: [this.$store.state.address, 'latest']},
        {p1: 'fsn', p2: 'getNotation', p3: [this.$store.state.address, 'latest']},
      ]
      this.$$.batchRequest(arr).then(res => {
        // console.log(res)
        this.getAssetsBalance(res[0])
        this.getAllTimelock(res[1])
        this.addrNode = res[2]
        this.getAssetsInfo()
        // console.log(this.assetsID)
        this.loading.init = false
      })
    },
    getAssetsBalance (res) {
      this.balanceData = []
      let fsnObj = { id: this.fsnId, balance: '0' }
      for (let obj in res) {
        this.assetsID.id.add(obj)
        if (obj === this.fsnId) {
          fsnObj = { id: obj, balance: res[obj] }
        } else {
          this.balanceData.push({ id: obj, balance: res[obj] })
        }
      }
      console.log(this.balanceData)
      this.balanceData.unshift(fsnObj)
      this.fsnBalance = this.$$.web3.utils.fromWei(fsnObj.balance, 'ether')
    },
    getAllTimelock (res) {
      this.timelockData = []
      let fsnObj = { id: this.fsnId, list: [] }
      for (let obj in res) {
        this.assetsID.id.add(obj)
        if (obj === this.fsnId) {
          fsnObj = { id: obj, list: res[obj].Items }
        } else {
          this.timelockData.push({ id: obj, list: res[obj].Items })
        }
      }
      if (fsnObj.list.length > 0) {
        this.timelockData.unshift(fsnObj)
      }
    },
    getAssetsInfo () {
      let arr = []
      // console.log(this.assetsID.id)
      for (let obj of this.assetsID.id.values()) {
        // console.log(obj)
        arr.push({p1: 'fsn', p2: 'getAsset', p3: [obj, 'latest']})
      }
      this.$$.batchRequest(arr).then(res => {
        // console.log(res)
        for (let obj of res) {
          this.assetsID.list[obj.ID] = obj
        }
        let bArr = []
        for (let obj of this.balanceData) {
          bArr.push({
            ...obj,
            ...this.assetsID.list[obj.id]
          })
        }
        this.balanceData = bArr
        console.log(this.balanceData)
        let tArr = []
        for (let obj of this.timelockData) {
          tArr.push({
            ...obj,
            ...this.assetsID.list[obj.id]
          })
        }
        this.timelockData = tArr
        this.getCrossChain()
        // console.log(this.timelockData)
      })
    },
    getCrossChain () {
      this.getSwapInfo().then(res => {
        this.swapTable = []
        for (let obj in res) {
          if (obj === 'ANY') {
            this.balanceData.splice(1, 0, res[obj])
          } else {
            this.swapTable.push({
              ...res[obj]
            })
          }
        }
        this.refresh.table = false
        this.$nextTick(() => {
          this.refresh.table = true
        })
        console.log(res)
      })
    },
    getBTCAddress () {
      if (this.chainId !== '46688') return
      this.registerAddress(this.$$.swapRPC, this.address).then(res => {
        // console.log(res)
        if (res.result) {
          this.btc.address = res.result.P2shAddress
          this.getBTCtxnsAll()
        }
      })
    },
    getBTCtxnsAll () {
      if (this.chainId !== '46688') return
      // let url = `https://sochain.com/api/v2/get_tx_unspent/BTC/${this.btc.address}` // 主网
      let url = `https://sochain.com/api/v2/get_tx_received/BTCTEST/${this.btc.address}` // 测试网
      this.btc.mintValue = 0
      this.getBTCTxnsAPI(url).then(res => {
        // console.log(res)
        if (res.status === "success" && res.data && res.data.txs.length > 0) {
          let useTxns = res.data.txs[res.data.txs.length - 1]
          this.getTxnStatusAPI(this.$$.swapRPC, useTxns.txid).then(txns => {
            // console.log(txns)
            if (txns.result) {
              // this.btc.mintValue = txns.result.value
              // this.btc.mintTip = true
              // this.btc.mintHash = useTxns.txid
              // this.btc.status = txns.result.status
              // this.btc.from = txns.result.from
              if ([0,5,7,8,9].includes(txns.result.status)) {
                this.btc.mintValue = txns.result.value
                this.btc.mintTip = true
                this.btc.mintHash = useTxns.txid
                this.btc.status = txns.result.status
                this.btc.from = txns.result.from
              } else {
                this.btc.mintTip = false
              }
            } else {
              this.btc.mintTip = false
            }
            this.getSetTimeoutBTCTxns()
          })
        } else {
          this.btc.mintTip = false
          this.getSetTimeoutBTCTxns()
        }
      })
    },
    openDepositView (item) {
      this.depositObj = item
      this.prop.deposit = true
    },
    openMintView () {
      this.prop.depositData = true
    },
    getSetTimeoutBTCTxns () {
      clearTimeout(this.btc.setTimeout)
      this.btc.setTimeout = setTimeout(() => {
        this.getBTCtxnsAll()
      }, 1000 * 30)
    },
    openQRcode () {
      this.prop.qrCode = true
      this.$nextTick(() => {
        this.$$.qrCode(this.$store.state.address, 'addressQRcode')
      })
    },
    createAddrNode () {
      this.$$.web3.fsntx.buildGenNotationTx({
        from: this.$store.state.address
      }).then(res => {
        console.log(res)
        res.chainId = this.chainId
        res.from = this.address
        // console.log(res)
        this.dataPage = res
        // this.dataPage.gasLimit = res.gas
        this.prop.pwd = true
      })
    },
    getSignData (data) {
      if (data.msg === 'Success') {
        this.$$.web3.eth.sendSignedTransaction(data.info, (err, hash) => {
          this.cancel()
          if (err) {
            this.msgError(err.toString())
          } else {
            console.log(hash)
            this.msgSuccess(this.$t('success').s_4 + 'Hash:' + hash)
          }
        })
      } else {
        this.msgError(data.error)
      }
    },
    setHistoryState (num) {
      let obj = {
        status: this.$t('state').depositing,
        class: 'color_green'
      }
      if ([0, 5, 8].includes(num)) {
        obj = { status: this.$t('state').confirming, class: 'color_green' }
      } else if ([7, 9].includes(num)) {
        obj = { status: this.$t('state').swapping, class: 'color_green' }
      } else if ([10].includes(num)) {
        obj = { status: this.$t('state').success, class: 'color_green' }
      } else if ([1, 2, 3, 4, 6, 11].includes(num)) {
        obj = { status: this.$t('state').fail, class: 'color_red' }
      } else if ([20].includes(num)) {
        obj = { status: this.$t('state').timeout, class: 'color_red' }
      }
      // console.log(num)
      // console.log(obj)
      return obj
    },
    getCoinInfo (coin) {
      if (typeof coinInfo[coin] !== 'undefined') {
        return coinInfo[coin]
      }
      return ''
    },
    qrcode (cont) {
      this.popup.qrcode = true
			this.$nextTick(() => {
        this.$$.qrCode(cont, "qrcode")
			})
    },
  },
  beforeDestroy () {
    clearTimeout(this.btc.setTimeout)
  }
}
</script>