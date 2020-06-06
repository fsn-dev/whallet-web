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
    address: "0xE000E632124aa65B80f74E3e4cc06DC761610583",
    keystore: "{\"version\":3,\"id\":\"b7ef8070-ad84-49d3-8c5f-d1e21fd35bfc\",\"address\":\"e000e632124aa65b80f74e3e4cc06dc761610583\",\"Crypto\":{\"ciphertext\":\"2c53ae3c0c59c90af9c9db0fe14f7b2c810cf4cfbf98c955db483824060b923e\",\"cipherparams\":{\"iv\":\"b9f262d7664cd9fe5f76b862758c70cd\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"salt\":\"70a6267c4f2f395fbaf98e65a891ab8ac002d2624766cc33aa5f0f800fe78b5b\",\"n\":8192,\"r\":8,\"p\":1},\"mac\":\"56346b8de7ba599633523230ea71206f79ac605f5a91c264951828fe037dbc60\"}}",
    walletType: 'keystore',
    // address: "",
    // keystore: '',
    // walletType: '',
    language: lang,
    HDPath: "",
    chainID: '',
    ksObj: {},
    network: ''
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
  },
})

export default store
