const PREFIX = 'a'

const USDT = PREFIX + 'USDT'
const BTC = PREFIX + 'BTC'
const ETH = PREFIX + 'ETH'
const UNI = PREFIX + 'UNI'
const FUSE = 'FUSE'
const XRP = PREFIX + 'XRP'
const LTC = PREFIX + 'LTC'

export default {
  '32659': {
    '0x0c74199D22f732039e843366a236Ff4F61986B32': { // ANY
      NAME: 'Anyswap',
      SYMBOL: 'ANY',
      DECIMALS: 18,
      MAXNUM: 100000000000,
      MINNUM: 0.00000000000001,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x049ddc3cd20ac7a2f6c867680f7e21de70aca9c3',
      ISSWITCH: 1,
      ISDEPOSIT: 0,
      ISREDEEM: 0,
      DEPOSIT_ADDRESS: ''
    },
    '0x445166c4854836292a5af7e3f165a3b8b4eedf97': { // mBTC
      NAME: 'SMPC Bitcoin',
      SYMBOL: BTC,
      DECIMALS: 8,
      MAXNUM: 0.01,
      MINNUM: 0.001,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x361450E73d63031feBE35Ca9fD772F3FD53E1013',
      ISSWITCH: 1,
      ISDEPOSIT: 1,
      ISREDEEM: 1,
      DEPOSIT_ADDRESS: '1HvrEMgxsYadWGhijpfygKSqPZ5p418g45'
    },
    '0xc7c64ac6d46be3d6ea318ec6276bb55291f8e496': { // mUSDT
      NAME: 'Tether',
      SYMBOL: USDT,
      DECIMALS: 6,
      MAXNUM: 1000000,
      MINNUM: 0.1,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x78917333bec47cee1022b31a136d31feff90d6fb',
      ISSWITCH: 1,
      ISDEPOSIT: 1,
      ISREDEEM: 1,
      DEPOSIT_ADDRESS: '0x94e840798e333cB1974E086B58c10C374E966bc7'
    },
    '0x5e12290c7e7eda58d092632a53bbbc717996c732': { // mETH
      NAME: 'Ethereum',
      SYMBOL: ETH,
      DECIMALS: 18,
      MAXNUM: 100,
      MINNUM: 0.00001,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x9ced18b0f8d7602f50d0061e6487021ec8114a1d',
      ISSWITCH: 1,
      ISDEPOSIT: 1,
      ISREDEEM: 1,
      DEPOSIT_ADDRESS: '0xCc6140a667980fbA8bF650b4aEC4f6e7Aff3a37F'
    },
    '0x6780bc1357dc0b6aa39224f53dc8aeceb093b6ff': { // UNI
      NAME: 'ANY Uniswap',
      SYMBOL: UNI,
      DECIMALS: 18,
      MAXNUM: 100000,
      MINNUM: 10,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x2F8cC99f9dea45306ec91612c67c2de36b825f9A',
      ISSWITCH: 1,
      ISDEPOSIT: 1,
      ISREDEEM: 1,
      DEPOSIT_ADDRESS: '0x94e840798e333cB1974E086B58c10C374E966bc7'
    },
    '0x20dd2f2bfa4ce3eaec5f57629583dad8a325872a': { // FUSE
      NAME: 'Fusionite',
      SYMBOL: FUSE,
      DECIMALS: 18,
      MAXNUM: 100000,
      MINNUM: 10,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0xe96aC326eceA1a09aE6E47487c5D8717f73d5A7e',
      ISSWITCH: 1,
      ISDEPOSIT: 1,
      ISREDEEM: 1,
      DEPOSIT_ADDRESS: ''
    },
    [XRP]: { // mXRP
      NAME: 'SMPC XRP',
      SYMBOL: XRP,
      DECIMALS: 6,
      MAXNUM: 1000000,
      MINNUM: 0.1,
      FEE: 0.001,
      EXCHANGE_ADDRESS: XRP,
      ISSWITCH: 0,
      ISDEPOSIT: 0,
      ISREDEEM: 0,
      DEPOSIT_ADDRESS: ''
    },
    [LTC]: { // mUSDT
      NAME: 'SMPC Litecoin',
      SYMBOL: LTC,
      DECIMALS: 6,
      MAXNUM: 1000000,
      MINNUM: 0.1,
      FEE: 0.001,
      EXCHANGE_ADDRESS: LTC,
      ISSWITCH: 0,
      ISDEPOSIT: 0,
      ISREDEEM: 0,
      DEPOSIT_ADDRESS: ''
    },
  },
  '46688': {
    '0xC20b5E92E1ce63Af6FE537491f75C19016ea5fb4': { // ANY
      NAME: 'Anyswap',
      SYMBOL: 'ANY',
      DECIMALS: 18,
      MAXNUM: 100000000000,
      MINNUM: 0.00000000000001,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x4dee5f0705ff478b452419375610155b5873ef5b',
      ISSWITCH: 1,
      ISDEPOSIT: 0,
      ISREDEEM: 0,
      DEPOSIT_ADDRESS: ''
    },
    '0x19543338473caaa6f404dbe540bb787f389d5462': { // mUSDT
      NAME: 'Tether',
      SYMBOL: USDT,
      DECIMALS: 6,
      MAXNUM: 1000000,
      MINNUM: 0.1,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x763858d914ebc7936977ab7c93b7331cea77b37c',
      ISSWITCH: 1,
      ISDEPOSIT: 1,
      ISREDEEM: 1,
      DEPOSIT_ADDRESS: '0x053C71206957422E1932481B7454Eee3112AFe95'
    },
    '0xeaeaeb2cf9921a084ef528f43e9e121e8291a947': { // mBTC
      NAME: 'SMPC Bitcoin',
      SYMBOL: BTC,
      DECIMALS: 8,
      MAXNUM: 100,
      MINNUM: 0.00001,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x0e711afa0da54bc718c777ae404386d3ad4774bc',
      ISSWITCH: 1,
      ISDEPOSIT: 1,
      ISREDEEM: 1,
      DEPOSIT_ADDRESS: ''
    },
    '0xeCd0fad9381b19feB74428Ab6a732BAA293CdC88': { // mETH
      NAME: 'Ethereum',
      SYMBOL: ETH,
      DECIMALS: 18,
      MAXNUM: 100,
      MINNUM: 0.00001,
      FEE: 0.001,
      EXCHANGE_ADDRESS: '0x9ab217c352b4122128d0024219f06e3503a8c7eb',
      ISSWITCH: 1,
      ISDEPOSIT: 1,
      ISREDEEM: 1,
      DEPOSIT_ADDRESS: '0xA79caC8B8ac2117C937B6c3ed3d888416F52d57e'
    },
    XRP: { // mXRP
      NAME: 'SMPC XRP',
      SYMBOL: XRP,
      DECIMALS: 6,
      MAXNUM: 1000000,
      MINNUM: 0.1,
      FEE: 0.001,
      EXCHANGE_ADDRESS: XRP,
      ISSWITCH: 0,
      ISDEPOSIT: 0,
      ISREDEEM: 0,
      DEPOSIT_ADDRESS: ''
    },
    LTC: { // mUSDT
      NAME: 'SMPC Litecoin',
      SYMBOL: LTC,
      DECIMALS: 6,
      MAXNUM: 1000000,
      MINNUM: 0.1,
      FEE: 0.001,
      EXCHANGE_ADDRESS: LTC,
      ISSWITCH: 0,
      ISDEPOSIT: 0,
      ISREDEEM: 0,
      DEPOSIT_ADDRESS: ''
    },
  }
}