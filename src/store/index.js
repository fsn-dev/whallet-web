import Vue from 'vue'
import Vuex from 'vuex'

// import cookie from '@/libs/cookie'

Vue.use(Vuex)

const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
const local = localStorage.getItem('language') ? localStorage.getItem('language') : localLang
let lang = local || 'en-US'


const store = new Vuex.Store({
  state: {
    address: "",
    keystore: '',
    walletType: '',
    language: lang,
    HDPath: "",
    chainID: '',
    ksObj: {},
    network: '',
    swapCoin: {}
  },
  mutations: {
    setAddress (state, data) {
      state.address = data
    },
    setKeystore (state, data) {
      state.keystore = data
    },
    setWalletType (state, data) {
      state.walletType = data
    },
    setLanguage (state, data) {
      // state.language = data
      let info = data.info ? data.info : ''
      state.language = info
      if (!data.type) {
        localStorage.setItem('language', info)
      }
    },
    setHDPath (state, data) {
      state.HDPath = data
    },
    setChainID (state, data) {
      state.chainID = data
    },
    setKsObj (state, data) {
      state.ksObj = data
    },
    setNetwork (state, data) {
      state.network = data
    },
    setSwapCoin (state, data) {
      state.swapCoin = data
    }
  },
})

export default store
