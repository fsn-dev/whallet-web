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
    // address: "0xE000E632124aa65B80f74E3e4cc06DC761610583",
    // keystore: "{\"version\":3,\"id\":\"b7ef8070-ad84-49d3-8c5f-d1e21fd35bfc\",\"address\":\"e000e632124aa65b80f74e3e4cc06dc761610583\",\"Crypto\":{\"ciphertext\":\"2c53ae3c0c59c90af9c9db0fe14f7b2c810cf4cfbf98c955db483824060b923e\",\"cipherparams\":{\"iv\":\"b9f262d7664cd9fe5f76b862758c70cd\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"salt\":\"70a6267c4f2f395fbaf98e65a891ab8ac002d2624766cc33aa5f0f800fe78b5b\",\"n\":8192,\"r\":8,\"p\":1},\"mac\":\"56346b8de7ba599633523230ea71206f79ac605f5a91c264951828fe037dbc60\"}}",
    // walletType: 'keystore',
    // address: "0xdf9CAf7c7e4540C605fdF17b978A6fa896a55156",
    // keystore: "{\"version\":3,\"id\":\"e4efee66-317c-4b9c-9440-9b5718295812\",\"address\":\"df9caf7c7e4540c605fdf17b978a6fa896a55156\",\"Crypto\":{\"ciphertext\":\"2bf82398a828857a2b748069c619e5239199be8ebb4a70e29d1ab7928ac58d7c\",\"cipherparams\":{\"iv\":\"1bdc993f1231c1ad5eee7c0b647f2bd5\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"salt\":\"edeaf70667de509b1d448bd1fd0403837c8a98a47bc59b2c93f1d836e66ec442\",\"n\":8192,\"r\":8,\"p\":1},\"mac\":\"88f92d14d215a8d944ee45cf8d9e9432e782dac43ef59d8874fcf5911390fd86\"}}",
    // walletType: 'keystore',
    // address: "0x6aA84a20b2BC61fFe71CB09C0e6e5fD064042061",
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
